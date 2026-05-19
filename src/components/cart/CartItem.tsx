"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/format";
interface CartItemProps {
  item: {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: number;
      images: string[];
      stock: number;
    };
  };
  onUpdate: (itemId: string, quantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
}

export function CartItem({ item, onUpdate, onRemove }: CartItemProps) {
  const [loading, setLoading] = useState(false);
  const imageUrl = item.product.images[0] ?? "https://placehold.co/80x80?text=No+Image";

  async function handleQuantityChange(delta: number) {
    const next = item.quantity + delta;
    if (next < 1) return;
    setLoading(true);
    try {
      await onUpdate(item.id, next);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove() {
    setLoading(true);
    try {
      await onRemove(item.id);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-4 py-4">
      <Link href={`/products/${item.product.id}`} className="shrink-0">
        <div className="relative h-20 w-20 overflow-hidden rounded-md bg-gray-100">
          <Image
            src={imageUrl}
            alt={item.product.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        <Link
          href={`/products/${item.product.id}`}
          className="text-sm font-medium text-gray-900 hover:underline line-clamp-2"
        >
          {item.product.name}
        </Link>
        <p className="text-sm font-bold text-gray-900">
          {formatCurrency(item.product.price)}
        </p>

        <div className="mt-auto flex items-center gap-2">
          <div className="flex items-center rounded-md border border-gray-200">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={loading || item.quantity <= 1}
              className="px-2 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-[2rem] text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={loading || item.quantity >= item.product.stock}
              className="px-2 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={loading}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
