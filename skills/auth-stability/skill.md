# Skill: Auth Stability

## Description
Stable, secure configuration of NextAuth for a production ecommerce app. Covers session management, route protection, role-based access, and secret rotation.

## When To Use
- When configuring or modifying `lib/auth.ts`
- When updating `middleware.ts` route matchers
- When adding a new OAuth provider or credentials flow
- When implementing role-based access control (RBAC)
- After any suspected security incident

## Key Principles
- **Never trust the client**: always call `getServerSession(authOptions)` server-side
- **Never expose** `NEXTAUTH_SECRET` in client-side code or repository
- Session cookies must be `httpOnly`, `secure` (production), and `sameSite: strict`
- All admin routes must be protected by middleware — not just individual page checks
- Roles live in the JWT token and database — always validate both
- Test sign-in, sign-out, and token refresh after every auth change

## Dependencies
- `next-auth` installed
- `NEXTAUTH_SECRET` set in Vercel environment (not `.env.local` in production)
- `NEXTAUTH_URL` set to the exact production domain
- Prisma adapter configured if using database sessions

## Pitfalls To Avoid
- **Using `session.user.id` from the client** — it can be spoofed; always re-fetch from DB
- **Forgetting middleware matchers** — a new route won't be protected until added to `matcher`
- **Session shape mismatch** — adding fields to the session without updating TypeScript types
- **Not testing OAuth callback URLs** — they must be registered exactly in the provider dashboard
- **Rotating `NEXTAUTH_SECRET` without a plan** — all active sessions are invalidated immediately
