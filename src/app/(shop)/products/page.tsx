import { Suspense } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";
import { Pagination } from "@/components/ui/Pagination";
import { getProducts } from "@/services/product.service";
import { Container } from "@/components/layout/Container";

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

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <Container className="py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {searchParams.category ?? "All Products"}
        </h1>
      </div>
      <Suspense fallback={<ProductGridSkeleton count={12} />}>
        <ProductList searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
