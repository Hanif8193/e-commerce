import { db } from "@/lib/db";
import type { OrderStatus } from "@prisma/client";

export async function getAllOrdersAdmin(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    db.order.findMany({
      skip,
      take: limit,
      include: {
        user: { select: { email: true } },
        items: { include: { product: { select: { name: true } } } },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    db.order.count(),
  ]);
  return { orders, total, totalPages: Math.ceil(total / limit) };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  return db.order.update({ where: { id: orderId }, data: { status } });
}

export async function getAdminStats() {
  const [totalOrders, totalRevenue, totalProducts, totalUsers] = await Promise.all([
    db.order.count(),
    db.order.aggregate({ _sum: { total: true }, where: { status: { in: ["PAID", "FULFILLED"] } } }),
    db.product.count({ where: { active: true } }),
    db.user.count(),
  ]);

  return {
    totalOrders,
    totalRevenue: totalRevenue._sum.total ?? 0,
    totalProducts,
    totalUsers,
  };
}
