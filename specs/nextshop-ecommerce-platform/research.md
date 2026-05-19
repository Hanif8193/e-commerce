# Research: NextShop E-Commerce Platform

**Branch**: `001-nextshop-ecommerce-platform` | **Date**: 2026-05-18

---

## Technology Decisions

### 1. Next.js App Router (over Pages Router)

**Decision**: Use App Router exclusively.

**Rationale**:
- React Server Components reduce client-side JavaScript (better LCP scores)
- Nested layouts (`layout.tsx`) allow shared auth/navigation without prop drilling
- `loading.tsx` and `error.tsx` per route segment enforce Principle VI (no blank pages)
- Built-in caching primitives (`revalidate`, `unstable_cache`) are the right tool
  for ISR on product listing pages
- Pages Router is in maintenance mode — App Router is the stable future

**Trade-offs**:
- RSC/Client Component boundary requires discipline: `"use client"` must be pushed
  to leaf nodes. Misplacing it inflates bundle size.
- Slightly higher learning curve for junior contributors.

**Risk mitigation**: `safe-nextjs-development` skill enforces RSC-first pattern
and catches misplaced `"use client"` in code review.

---

### 2. NextAuth v5 with Credentials Provider (over custom JWT auth)

**Decision**: Use NextAuth Credentials provider with bcrypt password hashing.

**Rationale**:
- NextAuth handles CSRF protection, session management, and cookie security by default
- Credentials provider supports email/password without external OAuth dependencies
- Easy upgrade path to OAuth providers (Google, GitHub) in future versions
- `getServerSession()` API is clean and prevents client-identity trust issues

**Trade-offs**:
- NextAuth adds abstraction overhead — debugging auth flows can be non-obvious.
- Credentials provider stores password hash in our DB (we own the security).

**Risk mitigation**: `auth-stability` skill enforces `getServerSession()` everywhere
and blocks client-passed identity patterns.

---

### 3. Stripe PaymentIntents (over Checkout Sessions)

**Decision**: Use PaymentIntents API with Stripe Elements on the frontend.

**Rationale**:
- PaymentIntents give us control over the full payment lifecycle
- Idempotency keys are native to the PaymentIntents API
- Webhook confirmation of `payment_intent.succeeded` enables webhook-first order
  creation pattern
- More flexible than Stripe Checkout Sessions for custom UI

**Trade-offs**:
- More complex integration than Stripe Checkout (hosted page).
- Webhook handling requires local Stripe CLI for development testing.

**Risk mitigation**: `ecommerce-checkout-safety` skill enforces idempotency key
strategy and atomic stock decrement pattern.

---

### 4. Prisma ORM (over raw SQL / Drizzle)

**Decision**: Prisma with the PostgreSQL adapter.

**Rationale**:
- Type-safe queries generated from schema eliminate SQL injection risk
- Migration system provides a safe, reviewable change pathway
- `$transaction` API enables atomic multi-step operations
- Singleton client pattern (lib/db.ts) prevents connection pool exhaustion

**Trade-offs**:
- Prisma adds schema-to-client compilation step (`npx prisma generate`)
- N+1 queries are possible without careful `include` usage — mitigated by
  `prisma-safety` skill enforcing `select` and batch queries.

---

### 5. Vercel Deployment (over self-hosted / Railway / Fly.io)

**Decision**: Vercel for hosting.

**Rationale**:
- Zero-config Next.js deployment with automatic preview URLs per branch
- Instant rollback to previous deployment
- Edge network and automatic HTTPS
- Vercel Analytics for real-user Core Web Vitals monitoring
- Environment variables per environment (development / preview / production)

**Trade-offs**:
- Vendor lock-in on Vercel-specific features (Edge Middleware, ISR invalidation)
- Serverless function cold starts can add TTFB on infrequent routes

**Risk mitigation**: `vercel-deployment` skill enforces preview-first workflow
and post-deploy monitoring protocol.

---

## Performance Strategy

| Page | Rendering | Caching | Rationale |
|---|---|---|---|
| Product listing `/products` | RSC + ISR | `revalidate: 60` | Public, cacheable, price changes acceptable at 60s lag |
| Product detail `/products/[id]` | RSC + ISR | `revalidate: 60` | Same as listing |
| Cart `/cart` | RSC + Dynamic | `no-store` | User-specific, must be real-time |
| Checkout | RSC + Dynamic | `no-store` | User-specific, must reflect current stock |
| Order history | RSC + Dynamic | `no-store` | User-specific, order status changes |
| Admin | RSC + Dynamic | `no-store` | Admin needs real-time inventory data |

**Image strategy**: All product images via `next/image` with:
- `width` and `height` to prevent CLS
- `priority` on the first image in any list or hero position (LCP)
- `sizes` attribute for responsive image selection

---

## Security Threat Model

| Threat | Mitigation |
|---|---|
| Unauthenticated access to protected routes | `middleware.ts` route matcher + handler double-check |
| Client price manipulation at checkout | Server-side price recalculation from DB |
| Duplicate charges on retry | Stripe idempotency key per user+cart combination |
| SQL injection | Prisma ORM type-safe queries |
| XSS | React JSX escaping by default; CSP header |
| Clickjacking | `X-Frame-Options: DENY` header |
| Fake Stripe webhooks | `stripe.webhooks.constructEvent()` signature verification |
| Admin route privilege escalation | Role check in middleware AND in each handler |
| Secret leakage | All secrets in Vercel env only; `.env.local` gitignored |
| Session fixation | NextAuth rotates session on login |
