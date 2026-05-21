import { Suspense } from "react";
import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";
import { Pagination } from "@/components/ui/Pagination";
import { getProducts, getCategories } from "@/services/product.service";
import { Container } from "@/components/layout/Container";
import { cn } from "@/utils/cn";

export const revalidate = 60;

interface ProductsPageProps {
  searchParams: { page?: string; category?: string };
}

async function ProductList({ searchParams }: ProductsPageProps) {
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const category = searchParams.category;

  const { products, total, totalPages } = await getProducts({
    page,
    limit: 12,
    category,
    activeOnly: true,
  });

  const params: Record<string, string> = {};
  if (category) params.category = category;

  return (
    <>
      <ProductGrid products={products} />
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/products"
            searchParams={params}
          />
        </div>
      )}
      <p className="mt-4 text-center text-sm text-gray-400">
        {total} product{total !== 1 ? "s" : ""}
      </p>
    </>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [categories] = await Promise.all([getCategories()]);
  const activeCategory = searchParams.category;

  return (
    <Container className="py-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {activeCategory ?? "All Products"}
        </h1>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            !activeCategory
              ? "border-brand-600 bg-brand-600 text-white"
              : "border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900"
          )}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/products?category=${encodeURIComponent(cat)}`}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors",
              activeCategory === cat
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900"
            )}
          >
            {cat}
          </Link>
        ))}
      </div>

      <Suspense fallback={<ProductGridSkeleton count={12} />}>
        <ProductList searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
