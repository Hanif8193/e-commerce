import { getAllProductsAdmin } from "@/services/product.service";
import { AdminProductTable } from "@/components/admin/AdminProductTable";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const metadata = { title: "Products — Admin — NextShop" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const raw = await getAllProductsAdmin();
  const products = raw.map((p) => ({ ...p, price: Number(p.price) }));

  return (
    <Container className="py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>
      <AdminProductTable products={products} />
    </Container>
  );
}
