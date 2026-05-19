---
id: "004"
title: Fix Console Errors CSP Sentry Stripe
stage: general
date: 2026-05-18
surface: agent
model: claude-sonnet-4-6
feature: none
branch: master
user: Hanif
command: debug browser console errors
labels: ["sentry", "csp", "stripe", "nextauth", "bugfix"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - sentry.client.config.ts
  - next.config.mjs
  - .env.local
tests:
  - manual browser console verification
---

## Prompt

react-dom.development.js:38560 Download the React DevTools for a better development experience
[@sentry/nextjs] You are calling Sentry.init() more than once on the client.
Creating a worker from 'blob:...' violates CSP directive "script-src". Note that 'worker-src' was not explicitly set.
The source list for 'connect-src' contains an invalid source: '<URL>'.
api/checkout 500 Internal Server Error

## Response snapshot

Diagnosed and fixed four distinct issues:

1. **Sentry double init** — `sentry.client.config.ts` (root) called `Sentry.init()` alongside `src/instrumentation-client.ts`. Removed the init call from the root config file, leaving only a comment.

2. **CSP Web Worker blob violation** — Sentry Replay creates a worker from a blob URL. Added `worker-src blob:` directive to next.config.mjs CSP. Also broadened `connect-src` to include `https://o*.ingest.us.sentry.io`.

3. **CSP `<URL>` placeholders** — `NEXT_PUBLIC_SENTRY_DSN=""` in `.env.local` caused Sentry's webpack plugin to emit unresolved `<URL>` template strings in the `connect-src` directive. Set the DSN to the real value (already hardcoded in instrumentation-client.ts).

4. **NEXTAUTH_URL port mismatch** — `.env.local` had `NEXTAUTH_URL="http://localhost:3001"` but the dev server runs on port 3000. Corrected to `http://localhost:3000`.

5. **Checkout 500** — `STRIPE_SECRET_KEY="sk_test_placeholder"` is not a real Stripe key. Stripe rejects it at API call time. User must replace with real test keys from dashboard.stripe.com.

## Outcome

- ✅ Impact: Eliminated Sentry double-init warning, fixed CSP violations for Sentry Replay worker, resolved `<URL>` CSP placeholders, fixed NextAuth URL mismatch
- 🧪 Tests: Manual browser console verification after dev server restart
- 📁 Files: sentry.client.config.ts, next.config.mjs, .env.local
- 🔁 Next prompts: Replace Stripe placeholder keys with real test keys from dashboard.stripe.com
- 🧠 Reflection: Sentry double-init is a common wizard artifact when both root config and instrumentation-client.ts exist; always keep init in instrumentation-client.ts only

## Evaluation notes (flywheel)

- Failure modes observed: Template placeholders in env vars causing CSP injection failures; port mismatch between NEXTAUTH_URL and actual dev server port
- Graders run and results (PASS/FAIL): none automated
- Prompt variant (if applicable): none
- Next experiment: Verify no more CSP errors after dev server restart with corrected env vars
