# Auth Stability — Checklist

## Pre-Action Checklist
- [ ] `NEXTAUTH_SECRET` is set in Vercel environment (not in repo)
- [ ] `NEXTAUTH_URL` matches the target deployment URL exactly
- [ ] OAuth provider callback URLs are registered correctly in provider dashboard
- [ ] Session type is extended in `types/auth.ts` if adding new session fields

## During Checklist
- [ ] Using `getServerSession(authOptions)` in all server-side auth checks
- [ ] Middleware `matcher` includes all new protected routes
- [ ] Admin routes (`/admin/**`, `/api/admin/**`) blocked for non-admin roles
- [ ] No `session.user.id` passed from client — always re-derive from server session
- [ ] NextAuth callbacks (`jwt`, `session`) handle missing/null values gracefully

## Post-Action Checklist
- [ ] Sign-in flow tested: email/password or OAuth → session established
- [ ] Sign-out flow tested: session cleared, redirected to login
- [ ] Protected route test: unauthenticated → 401/redirect; authenticated → 200
- [ ] Admin route test: customer role → 403; admin role → 200
- [ ] Session persists correctly after browser refresh
- [ ] `npm run build` passes — no TypeScript errors in auth types

## Emergency Recovery
```bash
# Rotate NEXTAUTH_SECRET (invalidates ALL active sessions)
# 1. Generate a new secret
openssl rand -base64 32

# 2. Update in Vercel dashboard (Environment Variables)
# 3. Redeploy — all users will be signed out

# Debug session issues
# Add to lib/auth.ts temporarily:
# debug: process.env.NODE_ENV === "development"
```
