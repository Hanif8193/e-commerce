# Database Migration Safety — Examples

## Example 1: Safe Additive Migration (New Column with Default)
```prisma
// prisma/schema.prisma
model Product {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique @default("")   // safe: has default
  createdAt DateTime @default(now())
}
```
```bash
npx prisma migrate dev --name add_product_slug
# Review: prisma/migrations/20240601_add_product_slug/migration.sql
# Apply staging: npx prisma migrate deploy
```

---

## Example 2: Safe Column Rename (3-Step Strategy)
```
Step 1: Add new column (slug) alongside old (url_slug) — deploy
Step 2: Migrate data: UPDATE "Product" SET slug = url_slug
Step 3: Drop old column (url_slug) — deploy
```
Never rename in one migration — old code breaks immediately.

---

## Example 3: Adding a NOT NULL Column to Existing Table
```prisma
// WRONG — fails on tables with existing rows
description String  // NOT NULL with no default

// CORRECT — two-step
// Step 1: Add as nullable
description String?

// Step 2: Backfill data, then add NOT NULL constraint in next migration
description String  @default("")
```

---

## Recovery: Migration Failed on Production
```bash
# 1. Do NOT run any more migrations — assess the state first
npx prisma migrate status

# 2. Mark the failed migration as rolled back
npx prisma migrate resolve --rolled-back 20240601_add_product_slug

# 3. Roll back the application code to the previous version
# (Vercel: Deployments → promote previous deployment)

# 4. Fix the migration in dev
npx prisma migrate dev --name fix_product_slug

# 5. Apply to staging → verify → apply to production
npx prisma migrate deploy
```
