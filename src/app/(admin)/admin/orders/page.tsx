import { getAllOrdersAdmin } from "@/services/admin.service";
import { AdminOrderTable } from "@/components/admin/AdminOrderTable";
import { Container } from "@/components/layout/Container";

export const metadata = { title: "Orders — Admin — NextShop" };
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const { orders: raw } = await getAllOrdersAdmin(1, 50);
  const orders = raw.map((o) => ({ ...o, total: Number(o.total) }));

  return (
    <Container className="py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Orders</h1>
      <AdminOrderTable orders={orders} />
    </Container>
  );
}
