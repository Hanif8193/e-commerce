# Production Hardening — Checklist

## Pre-Action Checklist
- [ ] `app/error.tsx` (global) exists with user-friendly fallback UI and retry button
- [ ] `app/api/health/route.ts` exists and verifies DB connectivity
- [ ] Sentry DSN is configured and events are flowing (send a test error)
- [ ] HTTP security headers are configured in `next.config.ts`
- [ ] Rate limiting is active on `/api/auth/`, `/api/checkout/`, `/api/payment/`

## During Checklist
- [ ] Error boundaries wrap all async content sections
- [ ] Sentry `beforeSend` hook scrubs PII (email, address, card data)
- [ ] `/api/health` checks `db.$queryRaw` or `db.user.count()` — not just returns 200
- [ ] Security headers include: `X-Frame-Options`, `X-Content-Type-Options`, `CSP`, `HSTS`
- [ ] External API calls (Stripe, shipping) have explicit timeouts and fallback error messages
- [ ] `process.on('unhandledRejection')` is logged — not silently swallowed

## Post-Action Checklist
- [ ] Trigger a test error — confirm Sentry receives it
- [ ] Hit `/api/health` from an external URL — confirm 200 + DB connected response
- [ ] Check HTTP response headers in browser DevTools → Network → any page → Headers
- [ ] Verify rate limiting rejects after threshold (use `curl` or Postman in a loop)
- [ ] Confirm error boundary shows fallback UI when a component throws

## Emergency Recovery
```bash
# Sentry not receiving events
# 1. Verify SENTRY_DSN is set in Vercel environment
# 2. Redeploy after adding DSN
# 3. Test with: throw new Error("Sentry test") in a Server Action

# Health check failing
# 1. Check DATABASE_URL is set correctly in Vercel
# 2. Check DB server is reachable from Vercel's region
# 3. Check Prisma connection pool is not exhausted
```
