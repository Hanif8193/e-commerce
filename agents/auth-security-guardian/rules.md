# Auth Security Guardian — Rules

## Strict DO Rules
- **DO** use `getServerSession(authOptions)` in every server-side auth check
- **DO** set `NEXTAUTH_SECRET` to a cryptographically random value (32+ bytes) in every environment
- **DO** set `NEXTAUTH_URL` to the exact base URL of the deployment
- **DO** configure cookies with `httpOnly: true`, `secure: true` (production), `sameSite: 'lax'`
- **DO** protect all `/admin` and `/api/admin` routes in `middleware.ts`
- **DO** return `null` in NextAuth callbacks to reject auth — never throw
- **DO** test sign-in, sign-out, and role enforcement after every auth change
- **DO** extend `types/auth.ts` whenever new fields are added to the session
- **DO** register OAuth callback URLs in the provider dashboard for every environment
- **DO** rotate `NEXTAUTH_SECRET` immediately on any suspected secret compromise

## Strict DON'T Rules
- **DON'T** trust user IDs passed from the client — always derive identity from `getServerSession()`
- **DON'T** store plaintext passwords — use NextAuth's credential provider with hashing
- **DON'T** expose `NEXTAUTH_SECRET` or OAuth client secrets in client components or API responses
- **DON'T** bypass auth middleware for "development convenience" — use a test account instead
- **DON'T** use wildcards in middleware matchers that could accidentally protect public assets
- **DON'T** throw unhandled exceptions inside NextAuth callbacks
- **DON'T** modify Prisma schema, API business logic, or UI components
- **DON'T** grant admin or vendor roles without explicit business requirement sign-off
- **DON'T** use JWT tokens without expiry — always set `maxAge` on the session
- **DON'T** deploy without verifying OAuth callback URLs match the production domain

## Recovery Steps
1. **All users logged out unexpectedly** — Check if `NEXTAUTH_SECRET` was rotated or changed; if so, this is expected; communicate to users and confirm the new secret is stable
2. **OAuth sign-in failing in production** — Verify the callback URL in the provider dashboard matches the exact production `NEXTAUTH_URL`; check for trailing slashes
3. **Admin route accessible to customer** — Immediately add or fix the middleware matcher for the route; check if `role` field is correctly populated in the JWT callback
4. **Session not persisting across requests** — Check `NEXTAUTH_URL` domain matches the request domain; verify cookie `secure` and `sameSite` settings
5. **`getServerSession()` returning null on a protected route** — Check that the route is not in an edge runtime that lacks session support; verify `authOptions` is imported correctly

## Escalation Triggers
| Trigger | Escalate To |
|---|---|
| New API route needs permission enforcement | backend-engineer (provide role requirements) |
| Schema change affects User, Account, or Session models | database-guardian |
| Suspected security breach or token exposure | deployment-engineer + production-hardening-agent immediately |
| New OAuth provider required | ecommerce-product-manager (confirm business requirement first) |
| Rate limiting needed on auth endpoints | production-hardening-agent |
| Auth change affects UI redirect behavior | frontend-architect |
