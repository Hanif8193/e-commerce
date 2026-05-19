import { notFound } from "next/navigation";
import { getProductById } from "@/services/product.service";
import { ProductForm } from "@/components/admin/ProductForm";
import { Container } from "@/components/layout/Container";

interface EditProductPageProps {
  params: { id: string };
}

export const metadata = { title: "Edit Product — Admin — NextShop" };

export default async function EditProductPage({ params }: EditProductPageProps) {
  const product = await getProductById(params.id, true);
  if (!product) notFound();

  return (
    <Container className="py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Product</h1>
      <ProductForm
        productId={product.id}
        initialValues={{
          name: product.name,
          description: product.description,
          price: String(product.price),
          category: product.category,
          stock: String(product.stock),
          images: product.images,
        }}
      />
    </Container>
  );
}
