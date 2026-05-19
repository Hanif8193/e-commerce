import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { Container } from "@/components/layout/Container";
import { getProductById, getProducts } from "@/services/product.service";

export const revalidate = 60;

interface ProductDetailPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  try {
    const { products } = await getProducts({ page: 1, limit: 100, activeOnly: true });
    return products.map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const product = await getProductById(params.id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} — NextShop`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProductById(params.id);

  if (!product || !product.active) {
    notFound();
  }

  return (
    <Container className="py-8">
      <ProductDetail product={product} />
    </Container>
  );
}
