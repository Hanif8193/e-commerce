"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface AddToCartButtonProps {
  productId: string;
  stock: number;
}

export function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const outOfStock = stock === 0;

  async function handleAddToCart() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Failed to add to cart");
        return;
      }

      setAdded(true);
      router.refresh();
      setTimeout(() => setAdded(false), 2000);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        onClick={handleAddToCart}
        disabled={outOfStock || loading}
        size="lg"
        className="w-full sm:w-auto"
      >
        {outOfStock
          ? "Out of Stock"
          : loading
          ? "Adding…"
          : added
          ? "Added to cart!"
          : "Add to Cart"}
      </Button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
