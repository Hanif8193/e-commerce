---
id: "002"
title: Admin product table delete action
stage: general
date: 2026-05-18
surface: agent
model: claude-sonnet-4-6
feature: none
branch: master
user: Hanif
command: "add Delete option to admin products page alongside Edit and Deactivate"
labels: ["admin","products","crud","delete","hard-delete"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/components/admin/AdminProductTable.tsx
  - src/services/product.service.ts
  - src/app/api/admin/products/[id]/route.ts
  - src/utils/validation.ts
tests:
  - "npx tsc --noEmit — PASS (no errors)"
---

## Prompt

"also make another in product page there are 2 option 1 edit 2. deactivate also add delete option also"

## Response snapshot

Added a third action column button — **Delete** (hard delete) — alongside the existing Edit and Deactivate buttons.

Changes:
- `product.service.ts`: added `hardDeleteProduct` — checks for OrderItem references (throws 409 if found), then deletes CartItems + Product in a transaction
- `route.ts` DELETE handler: now calls `hardDeleteProduct` instead of `softDeleteProduct`
- `validation.ts`: extended `updateProductSchema` with `active: z.boolean().optional()` so PATCH can toggle active
- `AdminProductTable.tsx`: refactored into 3 buttons per row:
  - **Edit** → links to edit page (unchanged)
  - **Deactivate/Reactivate** → PATCH `{ active: !current }` toggle (amber for deactivate, green for reactivate)
  - **Delete** → DELETE with confirmation dialog; removed from list on success; blocked server-side if product has orders

## Outcome

- ✅ Impact: Admin can now permanently delete products with no order history; products with orders show a clear error and must be deactivated instead
- 🧪 Tests: tsc --noEmit PASS
- 📁 Files: 4 files modified
- 🔁 Next prompts: Phase 9 hardening (rate limiting, Sentry, toasts)
- 🧠 Reflection: Separating soft delete (toggle active) from hard delete (permanent) keeps order history intact while giving admin full control over product lifecycle
