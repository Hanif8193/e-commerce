# Auth Security Guardian — Workflow

## Step-by-Step Workflow

1. **Receive task** — Read the auth or security requirement; confirm it falls within the auth boundary
2. **Audit current state** — Review `lib/auth.ts`, `middleware.ts`, and `types/auth.ts` for existing patterns
3. **Design role model** — Define which roles need access to which routes; document the access matrix
4. **Configure NextAuth callbacks** — Implement or update `session`, `jwt`, `signIn`, `authorize` callbacks in `lib/auth.ts`
5. **Update type augmentation** — Extend session/user types in `types/auth.ts` to include roles and custom fields
6. **Configure middleware** — Update `middleware.ts` route matchers to protect new or changed routes
7. **Test public routes** — Confirm unauthenticated access to public routes still works
8. **Test protected routes** — Test each protected route with: no session, customer, admin, vendor
9. **Test OAuth flows** — Sign in with each configured OAuth provider; verify callback and redirect
10. **Test sign-out** — Confirm session is cleared and user is redirected to login
11. **Security review** — Check cookie attributes, token expiry, and CSRF settings
12. **Open PR** — Tag backend-engineer for any API routes affected by new permission rules

---

## Decision Points

| Situation | Action |
|---|---|
| New route must be protected | Add route pattern to `middleware.ts` matcher; test all roles |
| New role needed (e.g., vendor) | Extend `types/auth.ts`; update JWT callback to include role; add middleware rule |
| OAuth provider needs to be added | Configure provider in `lib/auth.ts`; register callback URL with provider; test full flow |
| Session data must include custom field (e.g., shopId) | Add field in `jwt` callback from DB lookup; expose in `session` callback; update `types/auth.ts` |
| NEXTAUTH_SECRET suspected to be compromised | Rotate the secret immediately; notify deployment-engineer; accept that all sessions are invalidated |
| Admin route accessed by customer account | Confirm middleware matcher includes the route; check `role` field in session; return 403 |
| Auth callback throwing an unhandled error | Catch the error; log it; return `null` to safely reject the auth attempt |

---

## Handoff Instructions

**Handing off to backend-engineer:**
- Provide the updated session type so API routes can correctly read `session.user.role`
- Document which routes now require which roles
- Share the `getServerSession()` pattern for role-checking in protected API handlers

**Handing off to frontend-architect:**
- Confirm which UI routes are protected so `loading.tsx` and redirect logic is correct
- Share the session shape so UI can conditionally render admin/vendor features

**Handing off to deployment-engineer:**
- Provide list of environment variables: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, OAuth keys
- Confirm OAuth callback URL for each environment (preview, staging, production)
- Flag if session secret rotation is part of the deployment

**Handing off to production-hardening-agent:**
- Confirm rate limiting is needed on `/api/auth/signin` and `/api/auth/signup`
- Provide cookie security settings to verify in production HTTP headers
