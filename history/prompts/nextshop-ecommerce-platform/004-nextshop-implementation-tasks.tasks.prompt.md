---
id: "004"
title: "NextShop Implementation Tasks"
stage: tasks
date: 2026-05-18
surface: agent
model: claude-sonnet-4-6
feature: nextshop-ecommerce-platform
branch: 001-nextshop-ecommerce-platform
user: Hanif
command: /sp.tasks
labels: ["tasks","ecommerce","nextshop","implementation","tasklist"]
links:
  spec: specs/nextshop-ecommerce-platform/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/nextshop-ecommerce-platform/tasks.md
tests:
  - null
---

## Prompt

/sp.tasks — Generate implementation task list for NextShop E-Commerce Platform.
10 phases provided: project init, DB setup, auth, product system, cart,
checkout, payment, order history, admin dashboard, optimization & hardening.
Stack: Next.js App Router, TypeScript, Tailwind, Prisma/PostgreSQL, NextAuth,
Stripe, Vercel.

## Response snapshot

Generated tasks.md with 123 tasks (T001–T123) organized across 9 phases:

Phase 1 (Setup, T001–T008): Project init, TypeScript strict mode, Tailwind,
ESLint, folder structure, .env.example.

Phase 2 (Foundation, T009–T033): Prisma schema + migration, singleton db.ts,
seed data, NextAuth config, middleware route protection, Stripe client,
shared utilities (cn, format, validation, types), global app shell
(layout, error, not-found, loading, health check), base UI + layout components.

Phase 3 (US1 Catalog, T034–T049): product.service.ts, 7 UI components
(ProductCard, ProductGrid, Skeleton, StockBadge, ProductDetail,
ImageGallery, Pagination), ISR listing page (revalidate: 60), dynamic
detail page with notFound(), API routes for products.

Phase 4 (US2 Auth, T050–T055): signup server action with bcrypt,
LoginForm + SignupForm components, login/signup pages, Navbar auth state.

Phase 5 (US3 Cart, T056–T067): cart.service.ts (upsert, update, remove),
GET/POST /api/cart + PUT/DELETE /api/cart/[itemId], CartItem +
CartSummary + CartEmpty components, addToCart server action, cart page.

Phase 6 (US4 Checkout, T068–T079): payment.service.ts (PaymentIntent +
idempotency), order.service.ts (atomic $transaction + stock decrement),
/api/checkout + /api/webhooks/stripe routes, CheckoutForm + OrderSummary
+ PaymentForm + PaymentError components, checkout + success pages.

Phase 7 (US5 Orders, T080–T089): getOrdersByUserId + getOrderDetailByIdAndUserId,
/api/orders + /api/orders/[id], OrderCard + OrderStatusBadge + OrderDetail +
OrdersEmpty components, order list + detail pages.

Phase 8 (US6 Admin, T090–T110): product + order admin services,
/api/admin/products + /api/admin/orders routes, ProductForm +
AdminProductTable + AdminOrderTable components, admin server actions,
admin layout (role gate) + all admin pages.

Phase 9 (Hardening, T111–T123): Security headers, Sentry, rate limiting,
image audit, accessibility fixes, ISR cache invalidation, toast system,
full CI gate validation, P0 smoke test, health check verification.

## Outcome

- ✅ Impact: 123 production-ready tasks generated with exact file paths,
  story mappings (US1–US6), parallel markers [P], and phase checkpoints.
  Dependency order explicitly documented.
- 🧪 Tests: Manual acceptance checkpoints defined at end of each phase.
  T119 enforces the CI gate (lint + typecheck + build). T120 defines P0 smoke test.
- 📁 Files: specs/nextshop-ecommerce-platform/tasks.md (created)
- 🔁 Next prompts: /sp.implement to begin executing tasks phase by phase
- 🧠 Reflection: The highest-risk tasks are T072 (Stripe webhook handler —
  idempotency + atomic transaction), T069 (createOrderFromWebhook), and T096–T099
  (admin routes — double role check). These should be reviewed extra carefully
  during implementation.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): all tasks have file paths — PASS; all
  phases have checkpoints — PASS; dependency order documented — PASS;
  [P] markers present on parallelizable tasks — PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Split T072 (webhook handler) into two
  tasks: one for signature verification and one for order creation transaction.
