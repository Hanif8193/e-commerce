import Link from "next/link";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { formatCurrency, formatDate, truncateId } from "@/utils/format";
import type { Decimal } from "@prisma/client/runtime/library";

interface OrderCardProps {
  order: {
    id: string;
    status: "PENDING" | "PAID" | "FULFILLED" | "CANCELLED";
    total: Decimal;
    createdAt: Date;
    items: Array<{
      id: string;
      quantity: number;
      product: { name: string; images: string[] };
    }>;
  };
}

export function OrderCard({ order }: OrderCardProps) {
  const firstProduct = order.items[0]?.product;
  const remaining = order.items.length - 1;

  return (
    <Link
      href={`/orders/${order.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-900">
            Order #{truncateId(order.id)}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.createdAt)}</p>
          {firstProduct && (
            <p className="mt-2 text-sm text-gray-700 line-clamp-1">
              {firstProduct.name}
              {remaining > 0 && ` + ${remaining} more`}
            </p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="font-bold text-gray-900">{formatCurrency(order.total)}</p>
          <div className="mt-1">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
      </div>
    </Link>
  );
}
