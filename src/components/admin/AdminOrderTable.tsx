"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { formatCurrency, formatDate, truncateId } from "@/utils/format";
type OrderStatus = "PENDING" | "PAID" | "FULFILLED" | "CANCELLED";

interface AdminOrder {
  id: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  user: { email: string };
}

interface AdminOrderTableProps {
  orders: AdminOrder[];
}

export function AdminOrderTable({ orders: initial }: AdminOrderTableProps) {
  const router = useRouter();
  const [orders, setOrders] = useState(initial);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleStatusChange(id: string, status: OrderStatus) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status } : o))
        );
        router.refresh();
      }
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Customer</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">Total</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-600">Status</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-600">Update</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs text-gray-400">
                {truncateId(order.id)}
              </td>
              <td className="px-4 py-3 text-gray-700">{order.user.email}</td>
              <td className="px-4 py-3 text-gray-600">{formatDate(order.createdAt)}</td>
              <td className="px-4 py-3 text-right font-medium text-gray-900">
                {formatCurrency(order.total)}
              </td>
              <td className="px-4 py-3 text-center">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3 text-center">
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order.id, e.target.value as OrderStatus)
                  }
                  disabled={updatingId === order.id}
                  className="rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="FULFILLED">Fulfilled</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
