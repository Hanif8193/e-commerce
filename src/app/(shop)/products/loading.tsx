import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";
import { Container } from "@/components/layout/Container";

export default function ProductsLoading() {
  return (
    <Container className="py-8">
      <div className="mb-6 h-9 w-48 animate-pulse rounded bg-gray-200" />
      <ProductGridSkeleton count={12} />
    </Container>
  );
}
