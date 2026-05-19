# Backend Engineer — Workflow

## Step-by-Step Workflow

1. **Receive task** — Read feature spec or bug report; confirm it is backend scope
2. **Clarify data contract** — Define the request/response shape and error cases in writing before coding
3. **Design Zod schema** — Write input validation schema first; this becomes the contract
4. **Check auth requirements** — Determine if the endpoint is public, authenticated, or role-restricted
5. **Implement route/action** — Write the handler using Next.js API route conventions
6. **Add authentication check** — Call `getServerSession()` at the top of every protected handler
7. **Implement business logic** — Write pure functions for cart, order, and inventory logic; keep them testable
8. **Add Prisma queries** — Wrap all DB calls in `try/catch`; use transactions for multi-step operations
9. **Implement error handling** — Return consistent `{ error: string, code: string }` shape for all failures
10. **Write tests** — Unit tests for business logic; integration tests for API routes with mock DB
11. **Run typecheck** — Execute `npm run typecheck`; fix all errors
12. **Document the endpoint** — Update `.env.example` if new env vars are needed; note the endpoint in PR description
13. **Open PR** — Include request/response examples; tag auth-security-guardian if the change affects permissions

---

## Decision Points

| Situation | Action |
|---|---|
| Endpoint accesses user-specific data | Always call `getServerSession()` first; return 401 if no session |
| Multi-step DB operation (order + inventory) | Use `prisma.$transaction([...])` to ensure atomicity |
| External API call (payment, shipping) | Wrap in try/catch with timeout; return meaningful error to client |
| Input is untrusted (from request body/params) | Parse through Zod schema before any processing |
| Business logic becomes complex (>50 lines) | Extract to a named function in `lib/` with unit tests |
| New endpoint touches payment data | Notify auth-security-guardian and ecommerce-product-manager |
| Rate limit needed | Coordinate with production-hardening-agent to add middleware |
| Schema change needed to complete the feature | Stop and coordinate with database-guardian |

---

## Handoff Instructions

**Handing off to frontend-architect:**
- Provide the exact API URL, HTTP method, and response JSON shape
- Share TypeScript types for request and response payloads
- Document all possible error codes the UI must handle

**Handing off to database-guardian:**
- Describe the required schema change in writing
- Specify which fields need indexes for the queries you are running
- Provide example Prisma queries so the guardian understands access patterns

**Handing off to auth-security-guardian:**
- Flag any endpoint that changes permissions or role requirements
- Describe how session data is being used in the new route
- Request review whenever a new admin or privileged action is added

**Handing off to production-hardening-agent:**
- Identify endpoints that need rate limiting (auth, payment, checkout)
- Flag any endpoint that calls an external service needing circuit breaker protection
- Provide expected request volume estimates for capacity planning
