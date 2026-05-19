<!--
SYNC IMPACT REPORT
==================
Version change: [TEMPLATE] → 1.0.0
Bump type: MAJOR — First concrete ratification; all placeholders replaced with
           project-specific governance for NextShop E-Commerce Platform.
Ratification date: 2026-05-18
Last amended:      2026-05-18

Modified principles:
  [PRINCIPLE_1_NAME] → I.   Stability First          (new)
  [PRINCIPLE_2_NAME] → II.  Modular Architecture     (new)
  [PRINCIPLE_3_NAME] → III. Security by Default      (new)
  [PRINCIPLE_4_NAME] → IV.  Database Integrity       (new)
  [PRINCIPLE_5_NAME] → V.   Deployment Safety        (new)
  [PRINCIPLE_6_NAME] → VI.  UI/UX Excellence         (new)
  (added)            → VII. Crash Prevention         (new)
  (added)            → VIII.AI Agent Governance      (new)

Added sections:
  - Technology Stack (was [SECTION_2_NAME])
  - Development Workflow (was [SECTION_3_NAME])

Removed sections:
  - All placeholder sections and HTML template comments

Templates:
  ✅ .specify/templates/plan-template.md  — Constitution Check gates are
     derived dynamically at plan time; no static update required.
  ✅ .specify/templates/spec-template.md  — No constitution-specific
     references; aligned with Security and Modular Architecture principles.
  ✅ .specify/templates/tasks-template.md — No constitution-specific
     references; Phase structure aligns with incremental delivery principle.

Deferred TODOs:
  None — all fields resolved from user input dated 2026-05-18.
-->

# NextShop E-Commerce Platform Constitution

## Core Principles

### I. Stability First

Production stability MUST take priority over feature velocity at every decision
point. Experimental or pre-release dependencies MUST NOT be introduced without
documented approval. Every change MUST be incremental — a single PR MUST NOT
touch more than one subsystem. Working code paths (especially auth, cart, and
checkout) MUST NOT be rewritten unless a documented defect requires it.
"Working" is defined as: passes CI, passes manual smoke test, and has been
live in production without regression for at least one sprint.

**Rationale**: An ecommerce platform's primary obligation is availability.
A crash during checkout costs real revenue and irreversibly damages user trust.

### II. Modular Architecture

The codebase MUST maintain strict separation between frontend (`app/`,
`components/`, `styles/`) and backend (`app/api/`, `lib/`, `actions/`).
Each module MUST own its domain; no module MAY reach into another module's
internals without an explicit, documented interface. Reusable UI components
MUST live in `components/`; shared server utilities in `lib/`. APIs MUST be
self-contained — business logic MUST NOT bleed into route handlers.
Folder structure MUST remain clean and predictable; no ad-hoc directories.

**Rationale**: Modularity allows agents, developers, and CI tools to work
on isolated areas without causing unintended side effects across the system.

### III. Security by Default

All sensitive routes MUST be protected in `middleware.ts` before any handler
logic executes. Every API route MUST validate inputs with Zod on every request.
Secrets and credentials MUST live exclusively in environment variables and
MUST NOT appear in source code, logs, or error responses. Payment endpoints
MUST be authenticated and rate-limited. Admin routes MUST restrict access to
the `ADMIN` role enforced server-side via `getServerSession()` — client-passed
identity MUST never be trusted. Stack traces MUST NOT appear in API error
responses returned to clients.

**Rationale**: An ecommerce platform handles PII and payment data. A single
exposure incident causes irreversible reputational and legal consequences.

### IV. Database Integrity

`prisma/schema.prisma` is the single source of truth for all data models.
Migrations MUST be applied to a staging environment and verified before
production. Destructive operations (DROP, RENAME, adding NOT NULL without
a default) MUST be preceded by a verified database backup. Production data
MUST NEVER be deleted accidentally — all destructive migrations MUST follow
the add-migrate-drop strategy. A singleton Prisma client MUST be used via
`lib/db.ts`; `new PrismaClient()` MUST NOT be instantiated in route files.
`npx prisma migrate reset` is PROHIBITED on any non-development environment.

**Rationale**: Order, payment, and account data loss is unrecoverable and
carries financial and legal liability for the business.

### V. Deployment Safety

Every production deployment MUST pass the full CI gate in order:
`npm run lint` → `npm run typecheck` → `npm run build`.
Production MUST only be reached after a Vercel preview deployment has been
manually reviewed and the core user flows tested. All required environment
variables MUST be confirmed in Vercel before deploying. The previous stable
deployment ID MUST be recorded before every production deploy to enable
instant rollback. Post-deploy monitoring MUST run for a minimum of 30 minutes
covering Vercel Analytics and error tracking.

**Rationale**: Failed deployments during peak traffic cause direct revenue
loss. A gate-based process catches the majority of failures before users
encounter them.

### VI. UI/UX Excellence

All customer-facing UI MUST be mobile-first: base styles target 375px, with
`md:` and `lg:` overrides for larger viewports. Every interactive element
MUST have a visible keyboard focus ring and an accessible ARIA label or
associated `<label>`. Images MUST use `next/image` with explicit `width`,
`height`, and `alt`. Loading states MUST be communicated via skeleton loaders
or spinners — blank or unstyled pages are not acceptable. Color contrast MUST
meet WCAG 2.1 AA (≥ 4.5:1 for body text). The checkout flow MUST provide
clear, actionable error messages and explicit retry paths at every failure
point. Tailwind classes MUST use design tokens from `tailwind.config.ts`;
arbitrary values MUST be avoided.

**Rationale**: Checkout conversion is directly tied to UI quality, perceived
performance, and accessibility. A confusing checkout flow costs revenue.

### VII. Crash Prevention

Changes MUST be incremental: one concern per PR, one migration per schema
change, one bug per fix branch. No change MAY reach production without first
being verified on the Vercel preview URL. A rollback strategy MUST be defined
and documented before every major release. Features MUST be tested in
isolation before integration. The P0 core flows — authentication, cart,
checkout, and order confirmation — MUST pass a manual smoke test after any
related change, before the PR is merged.

**Rationale**: Large-scope changes increase blast radius and make root-cause
analysis slow. Incremental changes localize risk and reduce recovery time.

### VIII. AI Agent Governance

All AI agents operating on this codebase MUST adhere to the following rules:

- **Boundary respect**: Agents MUST only modify files within their defined
  scope. Cross-boundary changes require explicit coordination with the
  owning agent and documented justification.
- **Minimal diff**: Agents MUST produce the smallest viable change that
  satisfies the requirement. Refactoring unrelated code is prohibited.
- **Stability bias**: Agents MUST prefer proven, simple solutions over
  novel or advanced patterns that introduce risk.
- **CI gate**: Agents MUST confirm `npm run lint`, `npm run typecheck`, and
  `npm run build` pass before marking any task complete.
- **Safe zones**: Agents MUST NOT modify working authentication, payment
  logic, or database migrations without explicit instruction and a documented
  rollback plan approved before execution.
- **Professional output**: Agent responses MUST follow their defined output
  format. Vague or incomplete outputs MUST NOT be accepted as done.

**Rationale**: Ungoverned agents can silently introduce changes that span
the codebase and are invisible until production time, bypassing all human
review gates.

## Technology Stack

| Layer | Technology | Constraint |
|---|---|---|
| Framework | Next.js App Router (TypeScript) | MUST use App Router; Pages Router is prohibited |
| Styling | Tailwind CSS | MUST use design tokens; no arbitrary values |
| ORM | Prisma | MUST use singleton client; raw SQL only for performance-critical paths |
| Database | PostgreSQL | MUST not be accessed directly except through Prisma |
| Auth | NextAuth | MUST use `getServerSession()`; client-trust is prohibited |
| Deployment | Vercel | MUST use preview-first workflow; no direct production pushes |
| Language | TypeScript (strict) | `"strict": true` MUST be enabled; `any` MUST be avoided |

**Dependency policy**: New dependencies MUST be production-stable (no `alpha`,
`beta`, `rc` tags), actively maintained, and evaluated for bundle impact before
adoption.

## Development Workflow

Every feature or fix MUST follow this ordered workflow:

1. **Plan** — Write or reference a feature spec in `specs/<feature>/spec.md`
   with acceptance criteria before writing code.
2. **Architect** — Validate that the approach respects Principles I–VIII.
   Flag any violation to the appropriate agent.
3. **Implement incrementally** — One concern per commit. Never batch
   unrelated changes.
4. **Validate locally** — `npm run typecheck` then `npm run lint` then
   `npm run build`. All three MUST pass.
5. **Preview deploy** — Push to a branch; review the Vercel preview URL
   against acceptance criteria.
6. **Smoke test P0 flows** — Auth, cart, checkout, and order confirmation
   MUST be manually tested on the preview URL.
7. **Merge and monitor** — Merge to `main`, confirm production deployment,
   monitor for 30 minutes.

**Critical user flows that MUST NEVER regress**:
- User signup / login / logout
- Browse products and product detail
- Add to cart / update cart / remove from cart
- Checkout process (happy path + payment failure)
- Order history view
- Admin: product create / edit / delete

## Governance

**Authority**: This constitution supersedes all other practices, informal
conventions, and agent-level rules. In any conflict, this document wins.

**Amendment procedure**:
1. Propose the amendment in writing (PR description or spec entry).
2. State: what changes, why it changes, what it replaces.
3. Identify all downstream artifacts requiring update (templates, agent rules).
4. Apply the version bump per the policy below.
5. Update `LAST_AMENDED_DATE` to the amendment date.

**Versioning policy** (semantic):
- `MAJOR` — Backward-incompatible governance change: removing or fundamentally
  redefining a principle, or removing a mandatory section.
- `MINOR` — Additive change: new principle, new section, materially expanded
  guidance that introduces new obligations.
- `PATCH` — Non-semantic refinement: wording clarification, typo fix, example
  improvement, no new obligations introduced.

**Compliance**: All PRs MUST be reviewed against the applicable principles.
Reviewers MUST call out violations explicitly, not silently accept them.
Complexity that violates Principle I or II MUST be justified in the PR
description before merging. Agents MUST self-audit against Principle VIII
before submitting output.

**Guidance file**: For runtime agent guidance, refer to `CLAUDE.md` at the
repository root and the individual agent files under `agents/`.

**Version**: 1.0.0 | **Ratified**: 2026-05-18 | **Last Amended**: 2026-05-18
