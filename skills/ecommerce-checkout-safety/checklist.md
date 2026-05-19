# Ecommerce Checkout Safety — Checklist

## Pre-Action Checklist
- [ ] Price is recalculated server-side from DB — client-submitted price is never used
- [ ] Payment API calls use an `idempotencyKey` (e.g., `orderId` or UUID)
- [ ] Order creation and stock decrement are wrapped in a Prisma `$transaction`
- [ ] Webhook endpoint verifies signature before processing payment events
- [ ] `STRIPE_WEBHOOK_SECRET` is set in Vercel environment

## During Checklist
- [ ] Checkout API route is protected: requires authenticated session
- [ ] Cart items are validated against current DB stock before payment intent is created
- [ ] Payment error returns a user-friendly message — not a raw Stripe error code
- [ ] Order status defaults to `PENDING` — only moves to `PAID` on confirmed webhook event
- [ ] Email confirmation is triggered after webhook confirms payment — not after frontend redirect

## Post-Action Checklist
- [ ] Test happy path: add to cart → checkout → payment → order confirmation
- [ ] Test payment failure: declined card → user sees error → order stays PENDING
- [ ] Test concurrent purchase: two users buying the last item — only one succeeds
- [ ] Webhook receives test event and correctly updates order status
- [ ] No duplicate orders in DB after payment retry

## Emergency Recovery
```bash
# Duplicate charge detected — immediately
# 1. Refund via Stripe Dashboard → Payments → Refund
# 2. Update order status to REFUNDED in DB
# 3. Notify affected customer
# 4. Add idempotency key to the payment call that caused the duplicate
# 5. Deploy fix; re-test with Stripe test mode
```
