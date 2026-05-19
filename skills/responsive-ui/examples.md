# Responsive UI — Examples

## Example 1: Mobile-First Product Card
```tsx
// components/ProductCard.tsx
import Image from "next/image";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex flex-col rounded-lg border p-4 md:p-6">
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={400}
        height={400}
        className="w-full object-cover rounded"
      />
      <h2 className="mt-3 text-base font-semibold md:text-lg">{product.name}</h2>
      <p className="text-sm text-gray-500">${product.price}</p>
    </div>
  );
}
```

---

## Example 2: Accessible Button with Focus Ring
```tsx
<button
  onClick={handleAddToCart}
  className="rounded bg-blue-600 px-4 py-2 text-white
             hover:bg-blue-700
             focus-visible:outline-none focus-visible:ring-2
             focus-visible:ring-blue-500 focus-visible:ring-offset-2"
  aria-label="Add product to cart"
>
  Add to Cart
</button>
```

---

## Example 3: Skeleton Loader for Async List
```tsx
// components/ProductGridSkeleton.tsx
export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg bg-gray-200 h-64" />
      ))}
    </div>
  );
}
```

---

## Recovery: Styles Missing in Production
```bash
# 1. Confirm content paths in tailwind.config.ts include all component directories
content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"]

# 2. Rebuild
npm run build

# 3. If a class is dynamically constructed (e.g., `text-${color}-500`), add to safelist
# Never construct Tailwind classes dynamically — use full class names
```
