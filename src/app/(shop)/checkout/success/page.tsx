import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrderByPaymentIntent } from "@/services/order.service";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { formatCurrency, formatDate, truncateId } from "@/utils/format";

interface SuccessPageProps {
  searchParams: { payment_intent?: string };
}

export const dynamic = "force-dynamic";
export const metadata = { title: "Order Confirmed — NextShop" };

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const paymentIntentId = searchParams.payment_intent;
  if (!paymentIntentId) redirect("/products");

  let attempts = 0;
  let order = null;
  while (!order && attempts < 5) {
    order = await getOrderByPaymentIntent(paymentIntentId, session.user.id);
    if (!order) {
      await new Promise((r) => setTimeout(r, 1000));
      attempts++;
    }
  }

  if (!order) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Payment received!</h1>
        <p className="mt-2 text-gray-500">
          Your order is being processed. Check your{" "}
          <Link href="/orders" className="text-brand-600 hover:underline">
            order history
          </Link>{" "}
          shortly.
        </p>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-4 text-5xl">✓</div>
        <h1 className="text-2xl font-bold text-gray-900">Order Confirmed!</h1>
        <p className="mt-2 text-gray-500">
          Order #{truncateId(order.id)} placed on {formatDate(order.createdAt)}
        </p>

        <div className="mt-8 rounded-lg border border-gray-200 p-6 text-left">
          <h2 className="font-semibold text-gray-900">Items</h2>
          <ul className="mt-3 divide-y divide-gray-100">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between py-2 text-sm">
                <span className="text-gray-700">
                  {item.product.name} × {item.quantity}
                </span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(Number(item.unitPrice.toString()) * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 font-semibold">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/orders">View Orders</Link>
          </Button>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
