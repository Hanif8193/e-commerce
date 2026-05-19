import { ProductForm } from "@/components/admin/ProductForm";
import { Container } from "@/components/layout/Container";

export const metadata = { title: "New Product — Admin — NextShop" };

export default function NewProductPage() {
  return (
    <Container className="py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Add Product</h1>
      <ProductForm />
    </Container>
  );
}
