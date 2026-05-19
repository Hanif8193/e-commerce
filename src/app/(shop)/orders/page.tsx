import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrdersByUser } from "@/services/order.service";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrdersEmpty } from "@/components/orders/OrdersEmpty";
import { Container } from "@/components/layout/Container";

export const metadata = { title: "Orders — NextShop" };
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/orders");

  const orders = await getOrdersByUser(session.user.id);

  return (
    <Container className="py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Your Orders</h1>
      {orders.length === 0 ? (
        <OrdersEmpty />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </Container>
  );
}
