import { ProductCard } from "./ProductCard";
import type { Decimal } from "@prisma/client/runtime/library";

interface Product {
  id: string;
  name: string;
  price: Decimal;
  images: string[];
  category: string;
  stock: number;
  active: boolean;
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-gray-900">No products found</p>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 4} />
      ))}
    </div>
  );
}
