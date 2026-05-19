---
id: "003"
title: Phase 9 production hardening
stage: general
date: 2026-05-18
surface: agent
model: claude-sonnet-4-6
feature: none
branch: master
user: Hanif
command: "phase9"
labels: ["security","rate-limiting","sentry","toast","middleware","ci","hardening"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/middleware.ts
  - src/lib/rate-limit.ts
  - src/app/api/auth/signup/route.ts
  - src/app/api/checkout/route.ts
  - src/app/api/admin/upload/route.ts
  - src/context/ToastContext.tsx
  - src/components/ui/Toast.tsx
  - src/hooks/useToast.ts
  - src/components/admin/AdminProductTable.tsx
  - src/app/layout.tsx
  - tailwind.config.ts
  - sentry.client.config.ts
  - sentry.server.config.ts
  - sentry.edge.config.ts
  - instrumentation.ts
  - next.config.mjs
  - .env.local
  - .github/workflows/ci.yml
tests:
  - "npx tsc --noEmit — PASS"
  - "npm run lint — PASS (no warnings)"
---

## Prompt

"phase9"

## Response snapshot

Implemented all Phase 9 production hardening tasks:

1. **`src/middleware.ts`**: NextAuth `withAuth` protecting `/admin/*`, `/orders/*`, `/checkout/*`.
   Unauthenticated → `/login`. Authenticated non-admin on `/admin/*` → `/`.

2. **Rate limiting** (`src/lib/rate-limit.ts`): in-memory Map-based limiter.
   Applied: signup (5 req/15 min), checkout (10 req/min), upload (20 req/min).

3. **Toast system**: `ToastContext.tsx` (provider + `useToast`), `Toast.tsx` (container + component),
   `hooks/useToast.ts` (re-export). Slide-in animation added to Tailwind. Wired into root layout.
   `AdminProductTable` now uses `toast.success/error` instead of `alert()`.

4. **Sentry**: `sentry.{client,server,edge}.config.ts` + `instrumentation.ts`.
   Conditional on `NEXT_PUBLIC_SENTRY_DSN` — no-ops if not set. `next.config.mjs` wrapped with
   `withSentryConfig`. Sentry ingest added to CSP `connect-src`.

5. **GitHub Actions CI** (`.github/workflows/ci.yml`): lint → typecheck → build on push/PR to main/master.

## Outcome

- ✅ Impact: All critical routes protected at middleware layer; payment + auth endpoints rate-limited; toast UX live; Sentry ready to activate; CI gate in place
- 🧪 Tests: tsc PASS, ESLint PASS (0 warnings)
- 📁 Files: 18 files created/modified
- 🔁 Next prompts: Set NEXT_PUBLIC_SENTRY_DSN from sentry.io; add GitHub repo secrets for CI (DATABASE_URL, NEXTAUTH_SECRET); Vercel deployment
- 🧠 Reflection: In-memory rate limiter resets on cold starts — acceptable for Vercel serverless single-instance dev; upgrade to Upstash Redis if multi-region deployment needed
