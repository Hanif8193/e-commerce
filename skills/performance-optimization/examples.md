# Performance Optimization — Examples

## Example 1: ISR for Product Listing Page
```tsx
// app/products/page.tsx
export const revalidate = 60; // revalidate every 60 seconds

export default async function ProductsPage() {
  const products = await db.product.findMany({
    select: { id: true, name: true, price: true, imageUrl: true },
    where: { active: true },
  });
  return <ProductGrid products={products} />;
}
```
Public data is cached and rebuilt every 60 seconds — no per-request DB hit.

---

## Example 2: Priority Image for LCP
```tsx
// app/page.tsx — Hero image is the LCP element
import Image from "next/image";

<Image
  src="/hero-banner.jpg"
  alt="Summer sale"
  width={1200}
  height={600}
  priority           // preloads this image — critical for LCP
  sizes="100vw"
/>
```

---

## Example 3: Dynamic Import for Heavy Component
```tsx
import dynamic from "next/dynamic";

const ProductReviews = dynamic(
  () => import("@/components/ProductReviews"),
  {
    loading: () => <ReviewsSkeleton />,
    ssr: false,   // only if component uses browser APIs
  }
);

// In the page:
<Suspense fallback={<ReviewsSkeleton />}>
  <ProductReviews productId={id} />
</Suspense>
```

---

## Recovery: LCP Regression After Deploy
```bash
# 1. Run Lighthouse in incognito → record new LCP value
# 2. Check if hero image has priority prop
# 3. Check TTFB — if high, the issue is server-side (DB query or cold start)
# 4. Check if revalidate is still set correctly (not accidentally removed)
# 5. Review git diff for the last deploy — identify what changed
git diff HEAD~1 HEAD -- app/page.tsx
```
