# Skill: Production Hardening

## Description
Harden a Next.js ecommerce app against crashes, attacks, and unexpected load. Covers error boundaries, structured logging, rate limiting, HTTP security headers, and health checks.

## When To Use
- Before every major production release
- When setting up a new environment from scratch
- When a production crash reveals a missing safeguard
- When Sentry reports unhandled errors or missing error boundaries

## Key Principles
- **Fail visibly, not silently**: every error must be captured by Sentry and shown to the user via an error boundary — never a blank page
- **Defense in depth**: security headers + rate limiting + auth middleware — not just one layer
- **Health checks**: `/api/health` must verify DB connectivity — not just return 200
- **No PII in logs**: scrub emails, addresses, and payment data before sending to Sentry
- **Conservative rate limits**: start low, raise with evidence — a missed attack is worse than a temporarily stricter limit
- **Circuit breakers**: external APIs (payment, email, shipping) must have timeouts and fallbacks

## Dependencies
- `@sentry/nextjs` installed and configured
- `next.config.ts` for security headers
- `middleware.ts` for rate limiting and route protection
- `/api/health` route that checks DB connectivity

## Pitfalls To Avoid
- **Missing `app/error.tsx`**: uncaught render errors show blank page
- **Sentry without PII scrubbing**: accidentally logging user emails or card data
- **Security headers only in development**: headers must apply to production responses
- **Health check that doesn't check DB**: returns 200 even when DB is down
- **Rate limiting only on auth routes**: checkout and API routes are also attack surfaces
