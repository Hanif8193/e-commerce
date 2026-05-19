import { stripe } from "@/lib/stripe";

interface CartForCheckout {
  id: string;
  items: Array<{
    quantity: number;
    product: { price: { toString(): string } | number };
  }>;
}

function toNumber(d: { toString(): string } | number): number {
  if (typeof d === "number") return d;
  return Number(d.toString());
}

export async function createPaymentIntent(cart: CartForCheckout, userId: string) {
  if (!cart.items.length) throw new Error("Cart is empty");

  const amount = cart.items.reduce(
    (sum, item) =>
      sum + Math.round(toNumber(item.product.price) * 100) * item.quantity,
    0
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    metadata: { userId, cartId: cart.id },
    automatic_payment_methods: { enabled: true },
  });

  return paymentIntent;
}
