import { db } from "@/lib/db";

export async function getOrCreateCart(userId: string) {
  return db.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
    include: {
      items: {
        include: { product: true },
        orderBy: { productId: "asc" },
      },
    },
  });
}

export async function getCart(userId: string) {
  return db.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
        orderBy: { productId: "asc" },
      },
    },
  });
}

export async function addToCart(
  userId: string,
  productId: string,
  quantity: number
) {
  const product = await db.product.findUnique({
    where: { id: productId, active: true },
  });
  if (!product) throw new Error("Product not found");
  if (product.stock < quantity) throw new Error("Insufficient stock");

  const cart = await getOrCreateCart(userId);

  const existing = cart.items.find((i) => i.productId === productId);
  const newQty = (existing?.quantity ?? 0) + quantity;
  if (product.stock < newQty) throw new Error("Insufficient stock");

  return db.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    create: { cartId: cart.id, productId, quantity },
    update: { quantity: { increment: quantity } },
    include: { product: true },
  });
}

export async function updateCartItem(
  userId: string,
  cartItemId: string,
  quantity: number
) {
  const item = await db.cartItem.findFirst({
    where: { id: cartItemId, cart: { userId } },
    include: { product: true },
  });
  if (!item) throw new Error("Cart item not found");
  if (item.product.stock < quantity) throw new Error("Insufficient stock");

  return db.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
    include: { product: true },
  });
}

export async function removeCartItem(userId: string, cartItemId: string) {
  const item = await db.cartItem.findFirst({
    where: { id: cartItemId, cart: { userId } },
  });
  if (!item) throw new Error("Cart item not found");

  return db.cartItem.delete({ where: { id: cartItemId } });
}

export async function clearCart(userId: string) {
  const cart = await db.cart.findUnique({ where: { userId } });
  if (!cart) return;
  await db.cartItem.deleteMany({ where: { cartId: cart.id } });
}

export async function getCartItemCount(userId: string): Promise<number> {
  const result = await db.cartItem.aggregate({
    where: { cart: { userId } },
    _sum: { quantity: true },
  });
  return result._sum.quantity ?? 0;
}
