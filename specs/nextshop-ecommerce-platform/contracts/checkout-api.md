# API Contract: Checkout & Payment

**Base path**: `/api/checkout/`, `/api/webhooks/stripe/`
**Auth required**: Yes (checkout); No (webhook — verified by Stripe signature)
**Caching**: None — all dynamic

---

## POST /api/checkout

Creates a Stripe PaymentIntent for the authenticated user's current cart.
Server recalculates total from DB — client-submitted prices are ignored.

**Auth**: Session required.

**Request**
```json
{
  "shipping": {
    "name": "John Doe",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "US"
  }
}
```

**Validation (Zod)**
```ts
z.object({
  shipping: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(3),
    country: z.string().length(2),
  }),
})
```

**Server-side logic**
1. Validate session → get `userId`
2. Fetch cart with items and current DB prices
3. Validate cart is not empty
4. Calculate `total` server-side from `product.price × quantity`
5. Validate stock is available for all items
6. Create/retrieve Stripe PaymentIntent with:
   - `amount: Math.round(total * 100)` (cents)
   - `idempotencyKey: stripe-pi-${userId}-${cartId}`
   - `metadata: { userId, cartId }`
7. Return `clientSecret` to frontend

**Response 200**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "total": "89.97",
  "items": [
    { "name": "Classic White Tee", "quantity": 2, "unitPrice": "29.99" }
  ]
}
```

**Error Responses**
| Status | Code | Condition |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Invalid shipping fields |
| 400 | `EMPTY_CART` | Cart has no items |
| 400 | `OUT_OF_STOCK` | One or more items exceed available stock |
| 401 | `UNAUTHENTICATED` | No session |
| 500 | `SERVER_ERROR` | Stripe API error or DB failure |

---

## POST /api/webhooks/stripe

Stripe sends signed webhook events here. This endpoint:
1. Verifies the Stripe signature (rejects unsigned requests with 400)
2. Handles `payment_intent.succeeded` to create the Order
3. Handles `payment_intent.payment_failed` to update Payment status

**Auth**: None (public endpoint) — security via Stripe signature verification.

**Headers required by Stripe**
```
stripe-signature: t=xxx,v1=xxx,...
```

**Event: payment_intent.succeeded**

Server-side logic:
1. Verify signature: `stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)`
2. Extract `userId` and `cartId` from `paymentIntent.metadata`
3. Check if an Order already exists for this PaymentIntent (idempotency — skip if exists)
4. Begin `$transaction`:
   a. Decrement stock for each cart item (`stock: { gte: quantity }` guard)
   b. Create Order with status `PAID`
   c. Create OrderItems with `unitPrice` snapshotted from current DB price
   d. Create Payment record with `status: SUCCEEDED`
   e. Clear cart items
5. Commit transaction

**Response 200** (always — Stripe retries on non-2xx)
```json
{ "received": true }
```

**Response 400** — Invalid signature only.

**Idempotency**: Before creating an Order, check:
```ts
const existing = await db.payment.findUnique({
  where: { stripePaymentIntentId: paymentIntent.id }
});
if (existing) return Response.json({ received: true }); // Already processed
```

---

## Error Taxonomy

| Code | Meaning |
|---|---|
| `EMPTY_CART` | Checkout attempted with no cart items |
| `OUT_OF_STOCK` | Stock insufficient for one or more items at checkout time |
| `PAYMENT_FAILED` | Stripe declined the payment |
| `DUPLICATE_PROCESSED` | Webhook already processed (idempotency skip) |
| `INVALID_SIGNATURE` | Webhook signature verification failed |
| `SERVER_ERROR` | Unexpected failure — logged to Sentry |
