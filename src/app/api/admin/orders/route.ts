import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllOrdersAdmin } from "@/services/admin.service";
import { paginationSchema } from "@/utils/validation";
import type { Session } from "next-auth";

function requireAdmin(session: Session | null) {
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const deny = requireAdmin(session);
  if (deny) return deny;

  try {
    const { searchParams } = new URL(request.url);
    const parsed = paginationSchema.safeParse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    const { page, limit } = parsed.success ? parsed.data : { page: 1, limit: 20 };
    const result = await getAllOrdersAdmin(page, limit);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
