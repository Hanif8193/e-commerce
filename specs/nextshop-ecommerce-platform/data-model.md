# Data Model: NextShop E-Commerce Platform

**Branch**: `001-nextshop-ecommerce-platform` | **Date**: 2026-05-18

---

## Entity Relationship Overview

```
User ──────────────────┐
 │                     │
 │ 1:1 Cart            │ 1:N Orders
 ▼                     ▼
Cart               Order ─── 1:1 ─── Payment
 │                  │
 │ 1:N CartItems    │ 1:N OrderItems
 ▼                  ▼
CartItem       OrderItem
 │                  │
 └──── Product ─────┘
       (shared ref)
```

---

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Enums ────────────────────────────────────────────────────────────────────

enum Role {
  CUSTOMER
  ADMIN
}

enum OrderStatus {
  PENDING
  PAID
  FULFILLED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  SUCCEEDED
  FAILED
  REFUNDED
}

// ─── Models ───────────────────────────────────────────────────────────────────

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  role         Role     @default(CUSTOMER)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  cart   Cart?
  orders Order[]

  @@index([email])
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String   @db.Text
  price       Decimal  @db.Decimal(10, 2)
  images      String[]
  category    String
  stock       Int      @default(0)
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  cartItems  CartItem[]
  orderItems OrderItem[]

  @@index([category])
  @@index([active])
  @@index([active, category])
}

model Cart {
  id        String     @id @default(cuid())
  userId    String     @unique
  updatedAt DateTime   @updatedAt

  user  User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items CartItem[]
}

model CartItem {
  id        String  @id @default(cuid())
  quantity  Int     @default(1)
  cartId    String
  productId String

  cart    Cart    @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])

  @@unique([cartId, productId])
  @@index([cartId])
  @@index([productId])
}

model Order {
  id        String      @id @default(cuid())
  status    OrderStatus @default(PENDING)
  total     Decimal     @db.Decimal(10, 2)
  userId    String
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  user    User        @relation(fields: [userId], references: [id])
  items   OrderItem[]
  payment Payment?

  @@index([userId])
  @@index([status])
  @@index([userId, createdAt])
}

model OrderItem {
  id        String  @id @default(cuid())
  quantity  Int
  unitPrice Decimal @db.Decimal(10, 2)
  orderId   String
  productId String

  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])

  @@index([orderId])
  @@index([productId])
}

model Payment {
  id                    String        @id @default(cuid())
  stripePaymentIntentId String        @unique
  status                PaymentStatus @default(PENDING)
  amount                Decimal       @db.Decimal(10, 2)
  orderId               String        @unique
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt

  order Order @relation(fields: [orderId], references: [id])

  @@index([stripePaymentIntentId])
}
```

---

## Entity Notes

### User
- `passwordHash` stores bcrypt hash — never plaintext.
- `role` defaults to `CUSTOMER`; only elevated to `ADMIN` by direct DB operation
  or admin tooling — not user-facing.
- `cart` is a nullable 1:1 relation — created lazily on first add-to-cart.

### Product
- `images` is a `String[]` (Postgres array) — ordered list of image URLs.
- `active` flag used for soft delete (never hard DELETE a product with OrderItems).
- `price` uses `Decimal(10, 2)` — never `Float` for money values.
- `@@index([active, category])` supports the most common listing query filter.

### Cart / CartItem
- Cart is 1:1 with User (`@unique userId`).
- `@@unique([cartId, productId])` on CartItem enforces FR-014 (no duplicate line items).
  Upsert on this constraint increments quantity.
- `onDelete: Cascade` on Cart → CartItem: deleting a cart clears its items.

### Order / OrderItem
- `OrderItem.unitPrice` captures the price at time of purchase — allows price changes
  without corrupting order history.
- Order status machine: `PENDING → PAID` (webhook) → `FULFILLED` (manual) → `CANCELLED`.
- `PENDING` orders that never receive a webhook are cleaned up by a scheduled job
  (future phase — out of scope v1.0).

### Payment
- `stripePaymentIntentId @unique` — prevents duplicate payment records.
- 1:1 with Order. Only created after Stripe webhook fires.
- `status` mirrors Stripe PaymentIntent status values for easy reconciliation.

---

## Migration Strategy

1. Initial migration: all 7 models in one migration (`add_initial_schema`)
2. Subsequent changes: one concern per migration, descriptive name
3. Staging first: always `npx prisma migrate deploy` on staging before production
4. Rollback: all schema additions designed to be reversible at the field level

## Seed Data (prisma/seed.ts)

```typescript
// Creates:
// - 1 ADMIN user (admin@nextshop.com / password: admin123!)
// - 1 CUSTOMER user (customer@nextshop.com / password: customer123!)
// - 20 sample products across 4 categories with realistic data
// - 1 seeded order for the customer user (for order history testing)
```
