# Backend Engineer — Rules

## Strict DO Rules
- **DO** validate every request body and query parameter with a Zod schema
- **DO** call `getServerSession()` at the top of every authenticated route handler
- **DO** wrap all Prisma calls in `try/catch` blocks
- **DO** use `prisma.$transaction()` for any multi-step database mutation
- **DO** return `{ error: string, code: string }` for all error responses
- **DO** use HTTP status codes correctly: 200, 201, 400, 401, 403, 404, 409, 422, 500
- **DO** set timeouts on all calls to external APIs (payment, shipping, email)
- **DO** document every new endpoint with request/response schema in the PR description
- **DO** add regression tests for every bug fix in an API route
- **DO** add new environment variables to `.env.example` with placeholder values

## Strict DON'T Rules
- **DON'T** expose stack traces or raw error messages in API responses in production
- **DON'T** trust client-passed user IDs — always derive identity from the server session
- **DON'T** skip input validation for "internal" or "admin" routes
- **DON'T** modify `prisma/schema.prisma` without coordinating with database-guardian
- **DON'T** modify `lib/auth.ts` without coordinating with auth-security-guardian
- **DON'T** touch UI components, Tailwind, or `app/` layout files
- **DON'T** commit actual secrets — use `process.env.VAR_NAME` exclusively
- **DON'T** use `any` in route handler types or Zod schemas
- **DON'T** perform destructive DB operations (delete, update) without prior validation
- **DON'T** ship a payment or checkout route without idempotency handling

## Recovery Steps
1. **500 error in production** — Check server logs immediately; confirm it is not a missing env var; roll back if DB state is corrupted; fix and redeploy via deployment-engineer
2. **Zod validation failing for valid input** — Log the raw incoming payload; compare against the Zod schema; update the schema to match the agreed contract (not the other way)
3. **Prisma query timing out** — Check for missing index with database-guardian; add `@@index` on the filtered field; verify connection pool is not exhausted
4. **Auth session returning null unexpectedly** — Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set; check cookie domain and `sameSite` settings; escalate to auth-security-guardian
5. **External API call failing** — Check timeout and retry logic; add exponential backoff; if critical path (payment), return a clear 503 to the client

## Escalation Triggers
| Trigger | Escalate To |
|---|---|
| Schema change needed to implement feature | database-guardian |
| Route touches authentication, sessions, or RBAC | auth-security-guardian |
| New rate limiting needed on endpoint | production-hardening-agent |
| Business logic for a flow is unclear or contradictory | ecommerce-product-manager |
| API change breaks the UI contract | frontend-architect |
| Performance regression detected in API response time | performance-auditor |
| Production error spike after deployment | bug-fixer + deployment-engineer |
