# Production Hardening Agent — Workflow

## Step-by-Step Workflow

1. **Receive hardening task** — Read the request (pre-launch audit, incident response, or new hardening requirement)
2. **Identify the hardening area** — Classify as: security headers, error boundaries, rate limiting, observability, or health checks
3. **Audit current state** — Review existing `middleware.ts`, `next.config.ts`, `app/error.tsx`, and `lib/logger.ts` for gaps
4. **Check HTTP headers** — Inspect the current response headers using browser DevTools or `curl -I <url>`
5. **Review error boundaries** — Confirm every route segment has an `error.tsx`; test by triggering an error deliberately
6. **Review rate limiting** — Confirm rate limits are active on `/api/auth/`, `/api/checkout/`, `/api/payment/`
7. **Review health check** — Hit `/api/health` and confirm it checks DB connectivity, not just process health
8. **Review Sentry config** — Confirm DSN is set; confirm `beforeSend` scrubs PII; confirm error events are flowing
9. **Implement gaps** — Apply the smallest targeted hardening change that addresses the identified gap
10. **Test in preview** — Trigger the failure mode deliberately in the preview environment; confirm the hardening works
11. **Open PR** — Include evidence: headers screenshot, Sentry event screenshot, health check response
12. **Monitor post-deploy** — Watch Sentry for 24 hours after every major launch; respond to any new error patterns

---

## Decision Points

| Situation | Action |
|---|---|
| Security header is missing in production | Add it to `next.config.ts` headers config immediately; test in preview |
| Error boundary shows a blank page instead of fallback | Fix `app/error.tsx` to render a user-friendly message; add a retry button |
| Rate limit threshold too aggressive (blocking legitimate users) | Increase threshold with data evidence; add IP allow-list for known-good IPs |
| Sentry capturing PII (email, address, card data) | Add `beforeSend` filter to scrub the field immediately |
| Health check passing but DB is actually down | Add a real DB query to the health check — `SELECT 1` via Prisma |
| External API (payment gateway) times out | Ensure timeout + circuit breaker is in place; implement graceful degradation |
| New API route added without rate limiting | Add the route to the rate limiting middleware config |
| CSP blocks a legitimate resource | Audit the blocked resource; add the specific domain to the CSP allow-list (not a wildcard) |

---

## Handoff Instructions

**Handing off to backend-engineer:**
- Provide rate limiting thresholds and the implementation approach for new endpoints
- Share the error shape that the hardening layer expects from API routes
- Recommend timeout values for external API calls

**Handing off to deployment-engineer:**
- Provide the updated `next.config.ts` headers for review
- Confirm health check endpoint is ready and verified before deployment sign-off
- Share Sentry DSN environment variable name for the deployment checklist

**Handing off to auth-security-guardian:**
- Report any security header gaps related to auth cookies or CSRF
- Flag any CSP changes that affect the auth flow or OAuth redirects

**Handing off to production-hardening-agent (self, post-incident):**
- Document the incident: what failed, why the hardening did not prevent it, what the fix is
- Update the production readiness checklist with the new check
- Add a regression test or monitoring alert for the specific failure mode
