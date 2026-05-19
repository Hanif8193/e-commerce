# API Route Protection — Checklist

## Pre-Action Checklist
- [ ] Determined who can access this route: public / authenticated / admin only
- [ ] Zod schema defined for request body and query params
- [ ] Consistent error response shape defined: `{ error: string, code: string }`

## During Checklist
- [ ] Session check is the first operation in the handler
- [ ] Role check follows session check for non-public routes
- [ ] All request inputs parsed through Zod — `safeParse` used for graceful handling
- [ ] All DB calls in `try/catch` — 500 returned on unexpected error (no stack trace)
- [ ] HTTP status codes are semantically correct (401 vs 403, 400 vs 422)
- [ ] Sensitive routes have rate limiting applied
- [ ] No user-supplied data is used in raw SQL queries

## Post-Action Checklist
- [ ] Test: no auth → 401
- [ ] Test: wrong role → 403
- [ ] Test: invalid body → 400 with validation error message
- [ ] Test: valid request → 200 with expected response
- [ ] Test: rate limit → 429 after threshold
- [ ] Stack trace does NOT appear in error response body

## Emergency Recovery
```bash
# Suspected API abuse (high request volume from one IP)
# 1. Check Vercel logs for the pattern
vercel logs --follow | grep "/api/auth"

# 2. Add/lower rate limit threshold in middleware or route handler

# 3. If using Upstash — check rate limit dashboard for blocked IPs

# 4. Temporary: add IP blocklist in middleware.ts (last resort)
```
