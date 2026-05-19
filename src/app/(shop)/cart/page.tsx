import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCart } from "@/services/cart.service";
import { CartView } from "@/components/cart/CartView";
import { CartEmpty } from "@/components/cart/CartEmpty";
import { Container } from "@/components/layout/Container";

export const metadata = { title: "Cart — NextShop" };
export const dynamic = "force-dynamic";

export default async function CartPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/cart");

  const cart = await getCart(session.user.id);
  const items = (cart?.items ?? []).map((item) => ({
    ...item,
    product: { ...item.product, price: Number(item.product.price) },
  }));

  return (
    <Container className="py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Shopping Cart</h1>
      {items.length === 0 ? (
        <CartEmpty />
      ) : (
        <CartView initialItems={items} />
      )}
    </Container>
  );
}
