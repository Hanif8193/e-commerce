# Safe Next.js Development — Examples

## Example 1: Correct RSC Data Fetching
```tsx
// app/products/page.tsx — Server Component (no "use client")
async function ProductsPage() {
  const products = await db.product.findMany({ where: { active: true } });
  return <ProductList products={products} />;
}
```
No `useEffect`. No client state. Data fetched at the server level.

---

## Example 2: Correct Client Component Boundary
```tsx
// components/AddToCartButton.tsx
"use client";
import { useState } from "react";

export function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  // ... event handler only
}
```
`"use client"` is pushed to the leaf — the parent page stays a Server Component.

---

## Example 3: Route Segment Error + Loading Boundaries
```tsx
// app/products/loading.tsx
export default function Loading() {
  return <ProductGridSkeleton />;
}

// app/products/error.tsx
"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>Failed to load products.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## Example 4: Build Validation Commands
```bash
# Run before every PR
npm run lint        # ESLint — zero warnings
npm run typecheck   # tsc --noEmit — zero errors
npm run build       # Next.js production build — must succeed

# Check for unused exports (optional)
npx ts-unused-exports tsconfig.json
```

---

## Recovery: Fixing a Broken Build
```bash
# 1. Identify the error
npm run build 2>&1 | head -50

# 2. Fix TypeScript errors first
npm run typecheck

# 3. Fix lint errors
npm run lint -- --fix

# 4. Rebuild
npm run build
```
