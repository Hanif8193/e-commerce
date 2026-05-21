import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

interface GetProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  activeOnly?: boolean;
}

export async function getProducts({
  page = 1,
  limit = 20,
  category,
  activeOnly = true,
}: GetProductsParams = {}) {
  const where: Prisma.ProductWhereInput = {
    ...(activeOnly ? { active: true } : {}),
    ...(category ? { category } : {}),
  };

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        category: true,
        stock: true,
        active: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    }),
    db.product.count({ where }),
  ]);

  return {
    products,
    total,
    totalPages: Math.ceil(total / limit),
    page,
    limit,
  };
}

export async function getProductById(id: string, includeInactive = false) {
  return db.product.findUnique({
    where: { id, ...(includeInactive ? {} : { active: true }) },
  });
}

export async function getAllProductsAdmin() {
  return db.product.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
}) {
  return db.product.create({ data });
}

export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    stock: number;
    active: boolean;
  }>
) {
  return db.product.update({ where: { id }, data });
}

export async function softDeleteProduct(id: string) {
  await db.product.update({ where: { id }, data: { active: false } });
}

export async function getCategories(): Promise<string[]> {
  const rows = await db.product.findMany({
    where: { active: true },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return rows.map((r) => r.category);
}

export async function hardDeleteProduct(id: string) {
  const orderItemCount = await db.orderItem.count({ where: { productId: id } });
  if (orderItemCount > 0) {
    throw new Error(
      "Cannot delete a product that appears in existing orders. Deactivate it instead."
    );
  }
  await db.$transaction([
    db.cartItem.deleteMany({ where: { productId: id } }),
    db.product.delete({ where: { id } }),
  ]);
}
