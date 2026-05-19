"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { CartEmpty } from "./CartEmpty";
interface CartViewProps {
  initialItems: Array<{
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: number;
      images: string[];
      stock: number;
    };
  }>;
}

export function CartView({ initialItems }: CartViewProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);

  const handleUpdate = useCallback(async (itemId: string, quantity: number) => {
    const res = await fetch(`/api/cart/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (res.ok) {
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
      );
      router.refresh();
    }
  }, [router]);

  const handleRemove = useCallback(async (itemId: string) => {
    const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      router.refresh();
    }
  }, [router]);

  if (items.length === 0) return <CartEmpty />;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </div>
      <div>
        <CartSummary items={items} />
      </div>
    </div>
  );
}
