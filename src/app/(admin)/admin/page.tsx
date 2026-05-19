import { getAdminStats } from "@/services/admin.service";
import { Container } from "@/components/layout/Container";
import { formatCurrency } from "@/utils/format";

export const metadata = { title: "Admin Dashboard — NextShop" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const cards = [
    { label: "Total Orders", value: stats.totalOrders.toString() },
    { label: "Revenue", value: formatCurrency(stats.totalRevenue) },
    { label: "Active Products", value: stats.totalProducts.toString() },
    { label: "Users", value: stats.totalUsers.toString() },
  ];

  return (
    <Container className="py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-gray-200 bg-white p-5"
          >
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
