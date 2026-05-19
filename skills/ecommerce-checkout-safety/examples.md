# Ecommerce Checkout Safety — Examples

## Example 1: Server-Side Price Calculation
```ts
// app/api/checkout/route.ts
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { cartItems } = await req.json();
  const productIds = cartItems.map((i: CartItem) => i.productId);

  // Always fetch price from DB — never trust client
  const products = await db.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, price: true, stock: true },
  });

  const total = products.reduce((sum, p) => {
    const item = cartItems.find((i: CartItem) => i.productId === p.id);
    return sum + p.price * (item?.quantity ?? 0);
  }, 0);

  // Create Stripe payment intent with server-calculated total
  const paymentIntent = await stripe.paymentIntents.create(
    { amount: Math.round(total * 100), currency: "usd" },
    { idempotencyKey: `checkout-${session.user.id}-${Date.now()}` }
  );

  return Response.json({ clientSecret: paymentIntent.client_secret });
}
```

---

## Example 2: Atomic Order Creation
```ts
const order = await db.$transaction(async (tx) => {
  for (const item of cartItems) {
    const product = await tx.product.update({
      where: { id: item.productId, stock: { gte: item.quantity } },
      data: { stock: { decrement: item.quantity } },
    });
    if (!product) throw new Error(`Insufficient stock for ${item.productId}`);
  }
  return tx.order.create({ data: { userId, items: cartItems, status: "PENDING" } });
});
```
If stock is insufficient, the whole transaction rolls back — no partial state.

---

## Recovery: Order Stuck in PENDING
```
1. Check Stripe Dashboard — was payment collected?
2. If YES: manually trigger webhook resend from Stripe Dashboard
3. If webhook fails again: manually update order status via admin panel
4. Check webhook signature validation — ensure STRIPE_WEBHOOK_SECRET is correct
5. Check Sentry for webhook handler errors
```
