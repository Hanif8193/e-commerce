"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, truncateId } from "@/utils/format";
import { useToast } from "@/hooks/useToast";
interface AdminProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  active: boolean;
}

interface AdminProductTableProps {
  products: AdminProduct[];
}

export function AdminProductTable({ products: initial }: AdminProductTableProps) {
  const router = useRouter();
  const toast = useToast();
  const [products, setProducts] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleToggleActive(id: string, currentlyActive: boolean) {
    const action = currentlyActive ? "Deactivate" : "Reactivate";
    if (!confirm(`${action} this product?`)) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentlyActive }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, active: !currentlyActive } : p))
        );
        toast.success(`Product ${action.toLowerCase()}d`);
        router.refresh();
      } else {
        const data = (await res.json()) as { error?: string };
        toast.error(data.error ?? `Failed to ${action.toLowerCase()} product`);
      }
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (
      !confirm(
        `Permanently delete "${name}"?\n\nThis cannot be undone. Products with existing orders cannot be deleted — deactivate them instead.`
      )
    )
      return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success("Product deleted");
        router.refresh();
      } else {
        const data = (await res.json()) as { error?: string };
        toast.error(data.error ?? "Failed to delete product");
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Category</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">Price</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">Stock</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-600">Status</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs text-gray-400">
                {truncateId(product.id)}
              </td>
              <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
              <td className="px-4 py-3 text-gray-600">{product.category}</td>
              <td className="px-4 py-3 text-right text-gray-900">
                {formatCurrency(product.price)}
              </td>
              <td className="px-4 py-3 text-right text-gray-900">{product.stock}</td>
              <td className="px-4 py-3 text-center">
                <Badge variant={product.active ? "success" : "error"}>
                  {product.active ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <a href={`/admin/products/${product.id}/edit`}>Edit</a>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(product.id, product.active)}
                    disabled={busyId === product.id}
                    className={
                      product.active
                        ? "border-amber-400 text-amber-700 hover:bg-amber-50"
                        : "border-green-500 text-green-700 hover:bg-green-50"
                    }
                  >
                    {busyId === product.id
                      ? "…"
                      : product.active
                      ? "Deactivate"
                      : "Reactivate"}
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(product.id, product.name)}
                    disabled={busyId === product.id}
                  >
                    {busyId === product.id ? "…" : "Delete"}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
