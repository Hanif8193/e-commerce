# Skill: Ecommerce Checkout Safety

## Description
Safe implementation patterns for the ecommerce checkout flow: cart integrity, payment processing, order state management, idempotency, and error recovery.

## When To Use
- When implementing or modifying any part of the checkout flow
- When integrating or updating a payment gateway (Stripe, etc.)
- When debugging order creation failures or duplicate charges
- When reviewing the order state machine for correctness

## Key Principles
- **Idempotency**: every payment intent must be idempotent — use `idempotencyKey` on payment API calls to prevent duplicate charges
- **Server-side price calculation**: never trust client-submitted prices — always recalculate from DB on the server
- **Atomic order creation**: use Prisma transactions — order creation + stock decrement must be atomic
- **Order state machine**: `PENDING → PAID → FULFILLED → CANCELLED` — never skip states
- **Webhook verification**: verify payment gateway webhook signatures before processing events
- **No silent failures**: every checkout error must surface a user-friendly message and log to Sentry

## Dependencies
- Payment gateway SDK (e.g., `stripe`)
- Prisma transactions for atomic operations
- Webhook endpoint at `/api/webhooks/payment`
- `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in environment

## Pitfalls To Avoid
- **Trusting client price**: user sends `price: 0.01` in the request body — always re-fetch from DB
- **Non-idempotent payment calls**: retrying a failed request creates a duplicate charge
- **Missing webhook verification**: unverified webhooks allow fake order confirmation
- **Not handling payment failure UX**: user sees blank page or generic error — provide clear next steps
- **Decrementing stock outside a transaction**: stock can go negative under concurrent requests
