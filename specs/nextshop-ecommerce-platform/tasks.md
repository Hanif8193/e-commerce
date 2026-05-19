---
description: "Task list for NextShop E-Commerce Platform implementation"
---

# Tasks: NextShop E-Commerce Platform

**Input**: `specs/nextshop-ecommerce-platform/plan.md` + `spec.md`
**Branch**: `001-nextshop-ecommerce-platform`
**Date**: 2026-05-18
**Prerequisites**: plan.md ✅ spec.md ✅ data-model.md ✅ contracts/ ✅

**Format**: `[ID] [P?] [Story] Description → file path`
- **[P]**: Can run in parallel with other [P] tasks in the same phase
- **[Story]**: US1–US6 or Foundation

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project scaffolding, tooling, and environment baseline.
No blocking dependencies — all tasks can proceed immediately.

- [ ] T001 [P] Initialize Next.js 14 project with TypeScript and App Router → `package.json`, `tsconfig.json`, `next.config.ts`
- [ ] T002 [P] Enable TypeScript strict mode: `"strict": true`, `"noUncheckedIndexedAccess": true` → `tsconfig.json`
- [ ] T003 [P] Install and configure Tailwind CSS with project design tokens → `tailwind.config.ts`, `src/styles/globals.css`
- [ ] T004 [P] Configure ESLint with Next.js rules; add `npm run lint` script → `.eslintrc.json`, `package.json`
- [ ] T005 [P] Add `npm run typecheck` script (`tsc --noEmit`) to package.json → `package.json`
- [ ] T006 [P] Create full src/ folder structure: `app/`, `components/`, `features/`, `lib/`, `services/`, `hooks/`, `types/`, `utils/`, `styles/` → (directories)
- [ ] T007 [P] Create `.env.example` with all required keys (no values): `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` → `.env.example`
- [ ] T008 [P] Add `.env.local` to `.gitignore`; verify no secrets can be committed → `.gitignore`

**Checkpoint**: `npm run lint` and `npm run typecheck` both pass. Folder structure matches `plan.md`.

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Database, authentication infrastructure, singleton clients, middleware,
shared utilities. **No user story work begins until this phase is complete.**

**⚠️ CRITICAL**: All Phase 3+ tasks depend on Phase 2 completion.

### Database & ORM

- [ ] T009 Install Prisma and `@prisma/client`; initialize Prisma → `prisma/schema.prisma`, `package.json`
- [ ] T010 Write complete Prisma schema: models User, Product, Cart, CartItem, Order, OrderItem, Payment; enums Role, OrderStatus, PaymentStatus; all `@@index` and `@@unique` constraints → `prisma/schema.prisma`
- [ ] T011 Run initial migration: `npx prisma migrate dev --name add_initial_schema` → `prisma/migrations/`
- [ ] T012 Run `npx prisma generate` to produce typed client → `node_modules/@prisma/client`
- [ ] T013 Create singleton Prisma client using `globalThis` pattern → `src/lib/db.ts`
- [ ] T014 Write seed file: 20 products (4 categories), 1 ADMIN user (`admin@nextshop.com`), 1 CUSTOMER user (`customer@nextshop.com`), 1 seeded PAID order → `prisma/seed.ts`
- [ ] T015 Add seed script to `package.json`: `"db:seed": "npx ts-node prisma/seed.ts"` → `package.json`

### Authentication Infrastructure

- [ ] T016 Install `next-auth` and `bcryptjs` + `@types/bcryptjs` → `package.json`
- [ ] T017 Create NextAuth config with Credentials provider; extend session/JWT types with `id` and `role` → `src/lib/auth.ts`
- [ ] T018 Extend NextAuth TypeScript session type: `{ id: string; role: "CUSTOMER" | "ADMIN" }` → `src/types/auth.ts`
- [ ] T019 Create NextAuth API route handler → `src/app/api/auth/[...nextauth]/route.ts`

### Route Protection

- [ ] T020 Create `middleware.ts`: protect `/cart`, `/checkout`, `/orders` (requires session); protect `/admin` (requires ADMIN role); redirect unauthenticated to `/login` → `middleware.ts`

### Payment Client

- [ ] T021 Install `stripe` and `@stripe/stripe-js` and `@stripe/react-stripe-js` → `package.json`
- [ ] T022 Create Stripe server client singleton → `src/lib/stripe.ts`

### Shared Utilities

- [ ] T023 [P] Create `cn()` Tailwind className merge utility (clsx + tailwind-merge) → `src/utils/cn.ts`
- [ ] T024 [P] Create `formatCurrency()` and `formatDate()` utilities → `src/utils/format.ts`
- [ ] T025 [P] Create shared Zod validation schemas: email, password, pagination, cuid → `src/utils/validation.ts`
- [ ] T026 [P] Create shared TypeScript types: `Product`, `CartItem`, `Order`, `OrderItem` → `src/types/index.ts`

### Global App Shell

- [ ] T027 [P] Create root layout with Tailwind base, font setup, and global metadata → `src/app/layout.tsx`
- [ ] T028 [P] Create global error boundary with user-friendly fallback and retry button → `src/app/error.tsx`
- [ ] T029 [P] Create global 404 page with link back to `/products` → `src/app/not-found.tsx`
- [ ] T030 [P] Create global loading fallback (spinner or skeleton) → `src/app/loading.tsx`
- [ ] T031 [P] Create health check API route: DB connectivity check via `db.$queryRaw\`SELECT 1\`` → `src/app/api/health/route.ts`
- [ ] T032 [P] Create base UI components: `Button`, `Input`, `Label`, `Badge`, `Card`, `Skeleton` → `src/components/ui/`
- [ ] T033 [P] Create layout components: `Navbar` (auth state, cart count), `Footer`, `Container` → `src/components/layout/`

**Checkpoint — Phase 2 complete when**:
- `npx prisma migrate status` shows no pending migrations
- `npx prisma db seed` completes without error
- `GET /api/health` returns `{ "status": "ok", "db": "connected" }`
- Middleware redirects unauthenticated requests from `/cart` to `/login`
- Middleware redirects non-ADMIN requests from `/admin` to `/`

---

## Phase 3: User Story 1 — Product Catalog (Priority: P1) 🎯 MVP

**Goal**: Responsive, browsable product storefront. No auth required.
**Independent Test**: Seed DB → visit `/products` → see product grid → click product → see detail page.

### Services

- [ ] T034 [US1] Implement `getProducts({ page, limit, category })` with ISR-compatible fetch → `src/services/product.service.ts`
- [ ] T035 [US1] Implement `getProductById(id)` returning full product or null → `src/services/product.service.ts`

### UI Components

- [ ] T036 [P] [US1] Create `ProductCard` component: image (next/image + priority on first card), name, price, category, StockBadge → `src/components/product/ProductCard.tsx`
- [ ] T037 [P] [US1] Create `ProductGrid` component: responsive grid (`grid-cols-2 md:grid-cols-3 lg:grid-cols-4`) → `src/components/product/ProductGrid.tsx`
- [ ] T038 [P] [US1] Create `ProductGridSkeleton` (8-item animate-pulse skeleton for loading state) → `src/components/product/ProductGridSkeleton.tsx`
- [ ] T039 [P] [US1] Create `StockBadge` component: "In Stock" (green) / "Low Stock" (yellow, ≤5) / "Out of Stock" (red) → `src/components/product/StockBadge.tsx`
- [ ] T040 [P] [US1] Create `ProductDetail` component: image gallery, name, price, description, stock badge, Add to Cart button → `src/components/product/ProductDetail.tsx`
- [ ] T041 [P] [US1] Create `ProductImageGallery` component: main image + thumbnail strip, next/image, explicit width/height → `src/components/product/ProductImageGallery.tsx`
- [ ] T042 [P] [US1] Create `Pagination` component: prev/next, page count → `src/components/ui/Pagination.tsx`

### Pages

- [ ] T043 [US1] Create product listing page with ISR (`export const revalidate = 60`); use `Suspense` + `ProductGridSkeleton` fallback; pass `searchParams` for pagination and category filter → `src/app/(shop)/products/page.tsx`
- [ ] T044 [US1] Create product detail page: `generateStaticParams` for known products; `notFound()` for invalid IDs → `src/app/(shop)/products/[id]/page.tsx`
- [ ] T045 [US1] Create product listing loading state (re-exports `ProductGridSkeleton`) → `src/app/(shop)/products/loading.tsx`
- [ ] T046 [US1] Create product listing error boundary → `src/app/(shop)/products/error.tsx`
- [ ] T047 [US1] Create homepage page: redirect to `/products` → `src/app/(shop)/page.tsx`

### API Route (public read)

- [ ] T048 [US1] Create GET `/api/products` route: Zod-validated query params, paginated Prisma query, `active: true` filter → `src/app/api/products/route.ts`
- [ ] T049 [US1] Create GET `/api/products/[id]` route: return product or 404 `NOT_FOUND` → `src/app/api/products/[id]/route.ts`

**Checkpoint — US1 complete when**:
- `/products` shows seeded product grid with images, prices, stock badges
- Clicking a product navigates to `/products/[id]` with full detail
- Invalid product ID shows the 404 page (not a crash)
- Loading skeleton appears before products render
- `npm run build` passes

---

## Phase 4: User Story 2 — Authentication (Priority: P1)

**Goal**: Signup, login, session persistence, protected route redirection.
**Independent Test**: Sign up new user → session established → sign out → sign in again → session persists on refresh.

### Features

- [ ] T050 [US2] Create signup server action: validate email+password with Zod, check email uniqueness, hash password with bcrypt (cost 12), create User → `src/features/auth/signup.action.ts`
- [ ] T051 [US2] Create login form component with email/password fields, inline error display, loading state → `src/components/auth/LoginForm.tsx`
- [ ] T052 [US2] Create signup form component with email/password/confirm fields, validation errors → `src/components/auth/SignupForm.tsx`

### Pages

- [ ] T053 [US2] Create login page: render `LoginForm`, link to signup → `src/app/(auth)/login/page.tsx`
- [ ] T054 [US2] Create signup page: render `SignupForm`, link to login → `src/app/(auth)/signup/page.tsx`

### Navbar Update

- [ ] T055 [US2] Update `Navbar` to show Sign In link (unauthenticated) or user email + Sign Out button (authenticated); use `getServerSession()` → `src/components/layout/Navbar.tsx`

**Checkpoint — US2 complete when**:
- New user signs up → redirected to `/products` as authenticated user
- Valid credentials → session established; persists on page refresh
- Invalid credentials → inline error, no session created
- Sign out → session cleared, redirected to `/login`
- Unauthenticated user hitting `/cart` → redirected to `/login`

---

## Phase 5: User Story 3 — Shopping Cart (Priority: P2)

**Goal**: Cart persistence, item management, correct totals.
**Independent Test**: Authenticated user adds product → cart updates instantly → refresh → cart preserved.

### Services

- [ ] T056 [US3] Implement `getCartByUserId(userId)` with `include: { items: { include: { product } } }` → `src/services/cart.service.ts`
- [ ] T057 [US3] Implement `upsertCartItem(userId, productId, quantity)`: create cart if absent, upsert item with quantity increment → `src/services/cart.service.ts`
- [ ] T058 [US3] Implement `updateCartItemQuantity(cartItemId, userId, quantity)` with ownership check → `src/services/cart.service.ts`
- [ ] T059 [US3] Implement `removeCartItem(cartItemId, userId)` with ownership check → `src/services/cart.service.ts`

### API Routes

- [ ] T060 [US3] Create GET/POST `/api/cart` route: GET returns cart with totals; POST adds/increments item; Zod validation on all inputs; stock check before add → `src/app/api/cart/route.ts`
- [ ] T061 [US3] Create PUT/DELETE `/api/cart/[itemId]` route: verify item belongs to session user before update/delete → `src/app/api/cart/[itemId]/route.ts`

### UI Components

- [ ] T062 [P] [US3] Create `CartItem` component: product image, name, quantity controls (+/-), remove button, line total → `src/components/cart/CartItem.tsx`
- [ ] T063 [P] [US3] Create `CartSummary` component: item count, subtotal, proceed to checkout button → `src/components/cart/CartSummary.tsx`
- [ ] T064 [P] [US3] Create `CartEmpty` component: empty state message with link to `/products` → `src/components/cart/CartEmpty.tsx`

### Features

- [ ] T065 [US3] Create add-to-cart server action (called from Product Detail page) → `src/features/cart/addToCart.action.ts`
- [ ] T066 [US3] Wire Add to Cart button on Product Detail page to server action; show optimistic feedback → `src/components/product/ProductDetail.tsx`

### Page

- [ ] T067 [US3] Create cart page: fetch cart via `getCartByUserId`; render `CartItem` list or `CartEmpty`; render `CartSummary` → `src/app/(shop)/cart/page.tsx`

**Checkpoint — US3 complete when**:
- Authenticated user adds product from `/products/[id]` → cart count in Navbar increments
- `/cart` shows item, quantity controls, and correct subtotal
- Removing item updates cart instantly
- Same product added twice → quantity increments (no duplicate line)
- Cart still present after page refresh

---

## Phase 6: User Story 4 — Checkout & Payment (Priority: P2)

**Goal**: Stripe payment flow, webhook-confirmed order creation, idempotency.
**Independent Test**: Stripe test card `4242 4242 4242 4242` → order created → success page. Declined card `4000 0000 0000 0002` → error shown → no order in DB.

### Services

- [ ] T068 [US4] Implement `createPaymentIntent(userId, cartId)`: fetch cart, recalculate total from DB prices, create Stripe PaymentIntent with idempotency key `stripe-pi-${userId}-${cartId}` → `src/services/payment.service.ts`
- [ ] T069 [US4] Implement `createOrderFromWebhook(paymentIntentId, userId, cartId)`: atomic `$transaction` — decrement stock with `gte` guard, create Order (status PAID), create OrderItems (snapshot unitPrice), create Payment record, clear cart → `src/services/order.service.ts`
- [ ] T070 [US4] Implement `getOrderByPaymentIntentId(paymentIntentId)` for success page polling → `src/services/order.service.ts`

### API Routes

- [ ] T071 [US4] Create POST `/api/checkout` route: session required; Zod-validate shipping fields; call `createPaymentIntent`; return `clientSecret` and server-calculated `total` → `src/app/api/checkout/route.ts`
- [ ] T072 [US4] Create POST `/api/webhooks/stripe` route: verify Stripe signature with `stripe.webhooks.constructEvent`; handle `payment_intent.succeeded` (call `createOrderFromWebhook`); handle `payment_intent.payment_failed` (update Payment status); idempotency check before processing → `src/app/api/webhooks/stripe/route.ts`

### UI Components

- [ ] T073 [P] [US4] Create `CheckoutForm` component: shipping name, address, city, state, zip, country; Zod-validated client-side; submit button → `src/components/checkout/CheckoutForm.tsx`
- [ ] T074 [P] [US4] Create `OrderSummary` component: item list, unit prices, subtotal, total (from server) → `src/components/checkout/OrderSummary.tsx`
- [ ] T075 [P] [US4] Create `PaymentForm` component: Stripe Elements `<PaymentElement>` wrapper → `src/components/checkout/PaymentForm.tsx`
- [ ] T076 [P] [US4] Create `PaymentError` component: user-friendly error message with retry button → `src/components/checkout/PaymentError.tsx`

### Pages

- [ ] T077 [US4] Create checkout page: require authenticated session; fetch cart + server total via `/api/checkout`; render `CheckoutForm`, `OrderSummary`, `PaymentForm` in Stripe Elements provider → `src/app/(shop)/checkout/page.tsx`
- [ ] T078 [US4] Create checkout success page: poll for order by `payment_intent` query param; show order confirmation with ID and total → `src/app/(shop)/checkout/success/page.tsx`
- [ ] T079 [US4] Create checkout error boundary → `src/app/(shop)/checkout/error.tsx`

**Checkpoint — US4 complete when**:
- Test card `4242...` → webhook fires → order in DB with status PAID → success page renders
- Declined card `4000...` → `PaymentError` shown → zero orders in DB
- Payment retry after failure → no duplicate charge (idempotency key)
- Concurrent last-item purchase → only one order created; second user sees out-of-stock error
- `npm run build` passes

---

## Phase 7: User Story 5 — Order History (Priority: P3)

**Goal**: Authenticated user views their orders. No cross-user leakage.
**Independent Test**: Authenticated user with seeded order → `/orders` shows order list → click order → full detail renders.

### Services

- [ ] T080 [US5] Implement `getOrdersByUserId(userId, page, limit)`: `where: { userId }` — never return cross-user orders → `src/services/order.service.ts`
- [ ] T081 [US5] Implement `getOrderDetailByIdAndUserId(orderId, userId)`: 404 if not found OR wrong userId → `src/services/order.service.ts`

### API Routes

- [ ] T082 [US5] Create GET `/api/orders` route: session required; call `getOrdersByUserId`; return paginated list → `src/app/api/orders/route.ts`
- [ ] T083 [US5] Create GET `/api/orders/[id]` route: session required; call `getOrderDetailByIdAndUserId`; return 404 if not found or wrong user → `src/app/api/orders/[id]/route.ts`

### UI Components

- [ ] T084 [P] [US5] Create `OrderCard` component: order ID (truncated), date, status badge, total, "View Details" link → `src/components/order/OrderCard.tsx`
- [ ] T085 [P] [US5] Create `OrderStatusBadge` component: color-coded per status (PENDING/yellow, PAID/blue, FULFILLED/green, CANCELLED/red) → `src/components/order/OrderStatusBadge.tsx`
- [ ] T086 [P] [US5] Create `OrderDetail` component: item list with product image, name, qty, unit price, line total; payment status; order total → `src/components/order/OrderDetail.tsx`
- [ ] T087 [P] [US5] Create `OrdersEmpty` component: friendly empty state with link to `/products` → `src/components/order/OrdersEmpty.tsx`

### Pages

- [ ] T088 [US5] Create order history page: session required; fetch orders; render `OrderCard` list or `OrdersEmpty` → `src/app/(dashboard)/orders/page.tsx`
- [ ] T089 [US5] Create order detail page: session required; fetch by ID+userId; 404 if not found → `src/app/(dashboard)/orders/[id]/page.tsx`

**Checkpoint — US5 complete when**:
- Authenticated user with orders sees order list at `/orders`
- Clicking an order shows full detail with items and status
- User with no orders sees empty state (not error, not blank)
- Unauthenticated user → redirected to `/login`
- No other user's orders are accessible by any user

---

## Phase 8: User Story 6 — Admin Dashboard (Priority: P3)

**Goal**: ADMIN-role product CRUD and order management. Customer role gets 403.
**Independent Test**: Seed admin user → login → `/admin` accessible → create product → appears in storefront.

### Services

- [ ] T090 [US6] Implement `getAllProducts(page, limit, activeFilter)` including inactive products (admin view) → `src/services/product.service.ts`
- [ ] T091 [US6] Implement `createProduct(data)` → `src/services/product.service.ts`
- [ ] T092 [US6] Implement `updateProduct(id, data)` → `src/services/product.service.ts`
- [ ] T093 [US6] Implement `softDeleteProduct(id)`: set `active = false`; NEVER hard-delete if OrderItems exist → `src/services/product.service.ts`
- [ ] T094 [US6] Implement `getAllOrders(page, limit, statusFilter)` for admin → `src/services/order.service.ts`
- [ ] T095 [US6] Implement `updateOrderStatus(orderId, status)` → `src/services/order.service.ts`

### API Routes

- [ ] T096 [US6] Create GET/POST `/api/admin/products` route: double-check `role === "ADMIN"` server-side; Zod validate on POST; call product service → `src/app/api/admin/products/route.ts`
- [ ] T097 [US6] Create PUT/DELETE `/api/admin/products/[id]` route: role check; Zod validate; soft delete on DELETE → `src/app/api/admin/products/[id]/route.ts`
- [ ] T098 [US6] Create GET `/api/admin/orders` route: role check; paginated all orders → `src/app/api/admin/orders/route.ts`
- [ ] T099 [US6] Create PUT `/api/admin/orders/[id]` route: role check; update status with Zod enum validation → `src/app/api/admin/orders/[id]/route.ts`

### UI Components

- [ ] T100 [P] [US6] Create `ProductForm` component: name, description, price, images (URL inputs), category, stock; Zod-validated; create and edit modes → `src/components/admin/ProductForm.tsx`
- [ ] T101 [P] [US6] Create `AdminProductTable` component: sortable list of all products (incl. inactive); edit and deactivate actions → `src/components/admin/AdminProductTable.tsx`
- [ ] T102 [P] [US6] Create `AdminOrderTable` component: all orders with user email, total, status, status-update dropdown → `src/components/admin/AdminOrderTable.tsx`

### Admin Features (Server Actions)

- [ ] T103 [US6] Create admin product server actions: createProduct, updateProduct, deactivateProduct → `src/features/admin/product.actions.ts`
- [ ] T104 [US6] Create admin order server action: updateOrderStatus → `src/features/admin/order.actions.ts`

### Pages & Layout

- [ ] T105 [US6] Create admin layout: server-side role check; 403 response if not ADMIN → `src/app/admin/layout.tsx`
- [ ] T106 [US6] Create admin dashboard page: links to Products and Orders management → `src/app/admin/page.tsx`
- [ ] T107 [US6] Create admin products list page: render `AdminProductTable` → `src/app/admin/products/page.tsx`
- [ ] T108 [US6] Create admin new product page: render `ProductForm` (create mode) → `src/app/admin/products/new/page.tsx`
- [ ] T109 [US6] Create admin edit product page: fetch product, render `ProductForm` (edit mode) → `src/app/admin/products/[id]/edit/page.tsx`
- [ ] T110 [US6] Create admin orders page: render `AdminOrderTable` → `src/app/admin/orders/page.tsx`

**Checkpoint — US6 complete when**:
- Admin user creates product → appears in `/products` (after ISR revalidation or manual revalidation)
- Admin edits product price → updated in storefront
- Admin deactivates product → removed from storefront; OrderItems still reference it
- CUSTOMER role user hitting `/admin` → 403 (not crash)
- `npm run build` passes

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Production hardening, performance, accessibility, security headers.
All user stories must be complete before starting this phase.

- [ ] T111 [P] Add HTTP security headers to `next.config.ts`: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security` → `next.config.ts`
- [ ] T112 [P] Install and configure Sentry: `@sentry/nextjs`; add `beforeSend` hook to scrub PII (email, address) → `sentry.server.config.ts`, `sentry.client.config.ts`
- [ ] T113 [P] Add rate limiting to `/api/auth/` and `/api/checkout/` routes (in-memory or Upstash) → `middleware.ts` or route handlers
- [ ] T114 [P] Add `next/image` audit: verify all product images have explicit `width`, `height`, `alt`, and `priority` on first-in-list images → `src/components/product/`
- [ ] T115 [P] Verify all interactive elements have `focus-visible:ring` and ARIA labels; fix any missing accessibility attributes → `src/components/`
- [ ] T116 [P] Add `revalidatePath('/products')` call to admin product mutations to clear ISR cache after product changes → `src/features/admin/product.actions.ts`
- [ ] T117 [P] Verify color contrast ≥ 4.5:1 across all text elements; fix any failures → `tailwind.config.ts`, `src/components/`
- [ ] T118 [P] Add `useToast` hook and `Toast` component for success/error notifications → `src/hooks/useToast.ts`, `src/components/ui/Toast.tsx`
- [ ] T119 Run full validation gate and fix all failures:
  ```bash
  npm run lint      # must be zero errors
  npm run typecheck # must be zero errors
  npm run build     # must succeed
  ```
- [ ] T120 Manual smoke test of all P0 flows on production preview URL:
  - Signup → browse → add to cart → checkout → order confirmation
  - Admin: create product → edit → deactivate
  - Unauthenticated: `/cart` and `/admin` both redirect/403
- [ ] T121 Verify health check at `/api/health` returns `{ "status": "ok", "db": "connected" }` on preview URL
- [ ] T122 Verify Sentry receives a test error from the preview environment
- [ ] T123 Document any deferred items or known issues in `specs/nextshop-ecommerce-platform/` for the next sprint

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup           → No dependencies. Start immediately.
Phase 2: Foundation      → Depends on Phase 1. BLOCKS all user story phases.
Phase 3: US1 Catalog     → Depends on Phase 2. Parallel with Phase 4.
Phase 4: US2 Auth        → Depends on Phase 2. Parallel with Phase 3.
Phase 5: US3 Cart        → Depends on Phase 2 + Phase 4 (auth required for cart).
Phase 6: US4 Checkout    → Depends on Phase 5 (cart must work first).
Phase 7: US5 Orders      → Depends on Phase 6 (need completed orders for testing).
Phase 8: US6 Admin       → Depends on Phase 2 + Phase 3 (product schema required).
Phase 9: Hardening       → Depends on all Phase 3–8 being complete.
```

### Parallel Opportunities

- All [P] tasks within the same phase can run simultaneously
- Phase 3 (Product Catalog) and Phase 4 (Auth) can run in parallel after Phase 2
- Phase 8 (Admin) can start in parallel with Phases 5–7 once Phase 3 schema is ready
- All UI components within each phase marked [P] can be built simultaneously

### Within Each Phase

- Services before API routes
- API routes before pages
- UI components (all [P]) in parallel with services
- Pages last (depend on components + routes)

---

## Implementation Strategy

### MVP Path (Phases 1–4 + US1 smoke test)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundation (BLOCKS all stories)
3. Complete Phase 3: US1 — browsable product catalog
4. **STOP and VALIDATE**: `/products` grid + `/products/[id]` detail working
5. Complete Phase 4: US2 — working auth
6. **DEMO**: Authenticated browsable storefront

### Full Launch Path

1. Setup → Foundation → US1 → US2 → US3 → US4 → US5 → US6 → Hardening
2. Each story validated independently before moving to next
3. No phase skipping — dependencies are enforced

---

## Notes

- [P] = different files, no shared dependencies — safe to parallelize
- [USN] = maps task to specific user story for traceability
- Each checkpoint must pass before the next phase starts
- Every DB schema change requires a new named migration (not `db push`)
- All money values MUST use `Decimal` — never `Float` or `number`
- Commit after each task group or checkpoint — keep diffs small
- `npm run lint && npm run typecheck && npm run build` must pass before any PR is merged
