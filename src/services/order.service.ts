import { db } from "@/lib/db";
import type Stripe from "stripe";

function toNumber(d: unknown): number {
  if (typeof d === "number") return d;
  return Number(String(d));
}

export async function createOrderFromPaymentIntent(
  paymentIntent: Stripe.PaymentIntent
) {
  const { userId, cartId } = paymentIntent.metadata as {
    userId: string;
    cartId: string;
  };

  if (!userId || !cartId) throw new Error("Missing metadata on payment intent");

  const existing = await db.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
  });
  if (existing) return;

  const cart = await db.cart.findUnique({
    where: { id: cartId },
    include: { items: { include: { product: true } } },
  });
  if (!cart?.items.length) throw new Error("Cart empty or not found");

  await db.$transaction(async (tx) => {
    for (const item of cart.items) {
      const updated = await tx.product.updateMany({
        where: { id: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });
      if (updated.count === 0) {
        throw new Error(`Insufficient stock for product ${item.product.name}`);
      }
    }

    const total = cart.items.reduce(
      (sum, item) => sum + toNumber(item.product.price) * item.quantity,
      0
    );

    const order = await tx.order.create({
      data: {
        userId,
        status: "PAID",
        total,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        },
      },
    });

    await tx.payment.create({
      data: {
        orderId: order.id,
        stripePaymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        status: "SUCCEEDED",
      },
    });

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
  });
}

export async function getOrdersByUser(userId: string) {
  return db.order.findMany({
    where: { userId },
    include: {
      items: { include: { product: { select: { name: true, images: true } } } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(orderId: string, userId: string) {
  return db.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: { include: { product: true } },
      payment: true,
    },
  });
}

export async function getOrderByPaymentIntent(
  paymentIntentId: string,
  userId: string
) {
  const payment = await db.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntentId },
    include: {
      order: {
        include: {
          items: { include: { product: true } },
        },
      },
    },
  });

  if (!payment || payment.order.userId !== userId) return null;
  return payment.order;
}
