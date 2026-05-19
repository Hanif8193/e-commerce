# Production Hardening Agent — Rules

## Strict DO Rules
- **DO** verify all required HTTP security headers are present after every production deployment
- **DO** test error boundary behavior by deliberately triggering an error in the preview environment
- **DO** confirm `/api/health` queries the database (not just returns a static 200) before any deployment
- **DO** monitor Sentry for a minimum of 24 hours after every major production launch
- **DO** scrub PII from Sentry logs using the `beforeSend` hook (emails, addresses, payment data)
- **DO** apply rate limiting to `/api/auth/`, `/api/checkout/`, and `/api/payment/` at all times
- **DO** wrap all external API calls (payment, email, shipping) with timeout and circuit breaker
- **DO** run the production readiness checklist before every major release
- **DO** keep `app/error.tsx` providing a user-friendly message and a retry/home action
- **DO** configure `Strict-Transport-Security` with `includeSubDomains` and `preload` in production

## Strict DON'T Rules
- **DON'T** disable or weaken HTTP security headers in production — ever
- **DON'T** use `Content-Security-Policy: *` wildcards — be specific about allowed origins
- **DON'T** log sensitive data (passwords, tokens, card numbers, full addresses) to Sentry or any logger
- **DON'T** modify core business logic, Prisma schema, or auth configuration
- **DON'T** remove rate limiting from any auth, checkout, or payment endpoint
- **DON'T** mark a deployment healthy until `/api/health` returns 200 with a DB connectivity check
- **DON'T** ignore Sentry errors in the first 24 hours after a production launch
- **DON'T** implement rate limiting that could block authenticated users at normal usage levels
- **DON'T** use error boundaries that swallow errors silently — always log to Sentry
- **DON'T** add observability that creates a performance overhead > 10ms per request

## Recovery Steps
1. **Security header missing in production** — Add to `next.config.ts` headers config; deploy immediately; verify with `curl -I <url>`
2. **Error boundary showing blank page** — Deploy a fix to `app/error.tsx`; verify it renders the fallback by triggering the error in preview
3. **Sentry logging PII** — Add a `beforeSend` filter immediately; redact the field; audit existing events for exposure; notify auth-security-guardian
4. **Rate limiting blocking legitimate users** — Immediately increase the threshold or add an IP allow-list; use Sentry to identify the affected users; notify ecommerce-product-manager
5. **Health check returning 200 but site is broken** — Make the health check more comprehensive (check DB, check a critical query); fix the false positive; add alert for the actual failure mode

## Escalation Triggers
| Trigger | Escalate To |
|---|---|
| Security incident or suspected breach | auth-security-guardian immediately + deployment-engineer |
| Error rate spike in Sentry after deployment | bug-fixer + deployment-engineer (consider rollback) |
| Rate limiting requires business logic to define thresholds | ecommerce-product-manager |
| Health check reveals DB connectivity issue | database-guardian |
| CSP blocks payment provider scripts | backend-engineer + auth-security-guardian |
| New endpoint missing rate limiting | backend-engineer (add rate limit to the route) |
| Sentry event volume exceeds budget | ecommerce-product-manager (discuss sampling strategy) |
