import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrderById } from "@/services/order.service";
import { OrderDetail } from "@/components/orders/OrderDetail";
import { Container } from "@/components/layout/Container";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface OrderDetailPageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const order = await getOrderById(params.id, session.user.id);
  if (!order) notFound();

  return (
    <Container className="py-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/orders">&larr; Back to orders</Link>
        </Button>
      </div>
      <OrderDetail order={order} />
    </Container>
  );
}
