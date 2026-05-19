# Quickstart: NextShop E-Commerce Platform

**Branch**: `001-nextshop-ecommerce-platform` | **Date**: 2026-05-18

---

## Prerequisites

- Node.js 18+
- pnpm / npm / yarn
- PostgreSQL 15+ (local or cloud)
- Stripe account (test mode)
- Vercel CLI (for env management): `npm i -g vercel`

---

## 1. Clone and Install

```bash
git clone <repo-url>
cd nextshop
npm install
```

---

## 2. Configure Environment Variables

Copy the example file and fill in all values:

```bash
cp .env.example .env.local
```

Required values in `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nextshop_dev"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate with: openssl rand -base64 32>"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."  # from: stripe listen --print-secret
```

---

## 3. Database Setup

```bash
# Apply all migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed development data (products + admin/customer users)
npx prisma db seed
```

**Seed credentials**:
| Role | Email | Password |
|---|---|---|
| Admin | admin@nextshop.com | admin123! |
| Customer | customer@nextshop.com | customer123! |

---

## 4. Stripe Webhook (Development)

In a separate terminal, start the Stripe CLI to forward webhooks locally:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` key printed and add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`.

---

## 5. Start Development Server

```bash
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

---

## 6. Validation Commands

Run these before every PR and deployment:

```bash
npm run lint        # ESLint — must be zero errors
npm run typecheck   # tsc --noEmit — must be zero errors
npm run build       # Next.js production build — must succeed
```

---

## 7. Test Stripe Payments

Use Stripe test card numbers:

| Scenario | Card Number | CVC | Expiry |
|---|---|---|---|
| Successful payment | `4242 4242 4242 4242` | Any | Any future |
| Declined (generic) | `4000 0000 0000 0002` | Any | Any future |
| Insufficient funds | `4000 0000 0000 9995` | Any | Any future |

---

## 8. Prisma Studio (Database GUI)

```bash
npx prisma studio
# Opens at http://localhost:5555
```

---

## 9. Production Deployment

```bash
# 1. Pull Vercel env vars (first time setup)
vercel env pull .env.local

# 2. Confirm CI gate passes
npm run lint && npm run typecheck && npm run build

# 3. Deploy to preview
git push origin feature/your-branch
# Vercel auto-creates preview URL

# 4. Apply DB migrations on production
npx prisma migrate deploy

# 5. Promote to production (after preview review)
# Merge PR to main → Vercel auto-deploys

# 6. Verify health check
curl https://yourstore.vercel.app/api/health
```

---

## Common Issues

| Problem | Solution |
|---|---|
| `PrismaClientInitializationError` | Check `DATABASE_URL` is set and DB is running |
| `NEXTAUTH_SECRET is not set` | Add to `.env.local` and restart dev server |
| Stripe webhook not firing | Ensure `stripe listen` CLI is running in a separate terminal |
| `npm run build` fails | Run `npm run typecheck` first to identify TS errors |
| Products not showing | Run `npx prisma db seed` to populate the dev database |
