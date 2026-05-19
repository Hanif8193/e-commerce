import { NextResponse } from "next/server";
import { getProducts } from "@/services/product.service";
import { paginationSchema } from "@/utils/validation";
import { z } from "zod";

const querySchema = paginationSchema.extend({
  category: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      category: searchParams.get("category") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { page, limit, category } = parsed.data;
    const result = await getProducts({ page, limit, category, activeOnly: true });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
