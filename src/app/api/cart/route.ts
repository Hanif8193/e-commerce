import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCart, addToCart } from "@/services/cart.service";
import { addToCartSchema } from "@/utils/validation";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const cart = await getCart(session.user.id);
    return NextResponse.json(cart ?? { items: [] });
  } catch {
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: unknown = await request.json();
    const parsed = addToCartSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const item = await addToCart(
      session.user.id,
      parsed.data.productId,
      parsed.data.quantity
    );
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to add to cart";
    const status = message.includes("not found") ? 404
      : message.includes("stock") ? 409
      : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
