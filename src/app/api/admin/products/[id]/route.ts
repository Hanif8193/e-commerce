import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  updateProduct,
  hardDeleteProduct,
} from "@/services/product.service";
import { updateProductSchema } from "@/utils/validation";
import type { Session } from "next-auth";

function requireAdmin(session: Session | null) {
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const deny = requireAdmin(session);
  if (deny) return deny;

  try {
    const body: unknown = await request.json();
    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const product = await updateProduct(params.id, parsed.data);
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const deny = requireAdmin(session);
  if (deny) return deny;

  try {
    await hardDeleteProduct(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete product";
    const status = message.includes("Cannot delete") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
