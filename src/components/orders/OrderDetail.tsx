import Image from "next/image";
import Link from "next/link";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { formatCurrency, formatDate, truncateId } from "@/utils/format";
import type { Decimal } from "@prisma/client/runtime/library";

interface OrderDetailProps {
  order: {
    id: string;
    status: "PENDING" | "PAID" | "FULFILLED" | "CANCELLED";
    total: Decimal;
    createdAt: Date;
    items: Array<{
      id: string;
      quantity: number;
      unitPrice: Decimal;
      product: {
        id: string;
        name: string;
        images: string[];
      };
    }>;
  };
}

export function OrderDetail({ order }: OrderDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Order #{truncateId(order.id)}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="rounded-lg border border-gray-200">
        <ul className="divide-y divide-gray-100">
          {order.items.map((item) => {
            const imageUrl =
              item.product.images[0] ?? "https://placehold.co/64x64?text=No+Image";
            return (
              <li key={item.id} className="flex gap-4 p-4">
                <Link href={`/products/${item.product.id}`} className="shrink-0">
                  <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100">
                    <Image
                      src={imageUrl}
                      alt={item.product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                </Link>
                <div className="flex flex-1 items-center justify-between gap-4">
                  <div>
                    <Link
                      href={`/products/${item.product.id}`}
                      className="text-sm font-medium text-gray-900 hover:underline line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-gray-900">
                    {formatCurrency(
                      Number(item.unitPrice.toString()) * item.quantity
                    )}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="flex justify-between border-t border-gray-200 p-4 font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
