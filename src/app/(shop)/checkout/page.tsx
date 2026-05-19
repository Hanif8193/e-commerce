import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCart } from "@/services/cart.service";
import { CheckoutWrapper } from "@/components/checkout/CheckoutWrapper";
import { CartSummary } from "@/components/cart/CartSummary";
import { Container } from "@/components/layout/Container";

export const metadata = { title: "Checkout — NextShop" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/checkout");

  const cart = await getCart(session.user.id);
  if (!cart?.items.length) redirect("/cart");

  const serializedItems = cart.items.map((item) => ({
    ...item,
    product: { ...item.product, price: Number(item.product.price) },
  }));

  const origin =
    process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const returnUrl = `${origin}/checkout/success`;

  return (
    <Container className="py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Payment</h2>
          <CheckoutWrapper returnUrl={returnUrl} />
        </div>
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Order Summary
          </h2>
          <CartSummary items={serializedItems} />
        </div>
      </div>
    </Container>
  );
}
