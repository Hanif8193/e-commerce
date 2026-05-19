# Prisma Safety — Examples

## Example 1: Singleton Client (lib/db.ts)
```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```
One instance per process. Prevents connection pool exhaustion in serverless.

---

## Example 2: Safe Query with Select + Error Handling
```ts
try {
  const product = await db.product.findUnique({
    where: { id: productId },
    select: { id: true, name: true, price: true, stock: true },
  });
  if (!product) return { error: "Product not found", code: "NOT_FOUND" };
  return product;
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2025 = record not found
    return { error: "Database error", code: error.code };
  }
  throw error;
}
```

---

## Example 3: Transaction for Order Creation
```ts
const order = await db.$transaction(async (tx) => {
  const newOrder = await tx.order.create({ data: orderData });
  await tx.product.update({
    where: { id: productId },
    data: { stock: { decrement: quantity } },
  });
  return newOrder;
});
```
Atomic: if stock update fails, order creation is rolled back.

---

## Recovery: Migration Failed
```bash
# 1. Check the current migration state
npx prisma migrate status

# 2. Mark failed migration as rolled back
npx prisma migrate resolve --rolled-back 20240101000000_add_order_status

# 3. Fix the schema
# Edit prisma/schema.prisma

# 4. Create a corrected migration
npx prisma migrate dev --name fix_order_status
```
