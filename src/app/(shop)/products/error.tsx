"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";

interface ProductsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductsError({ error, reset }: ProductsErrorProps) {
  useEffect(() => {
    console.error("Products page error:", error);
  }, [error]);

  return (
    <Container className="py-20 text-center">
      <h2 className="text-xl font-semibold text-gray-900">
        Failed to load products
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        Something went wrong. Please try again.
      </p>
      <Button onClick={reset} className="mt-6" size="sm">
        Try again
      </Button>
    </Container>
  );
}
