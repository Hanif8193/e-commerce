import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
      <p className="mt-1 text-sm text-gray-500">
        Browse our products and add something you love.
      </p>
      <Button asChild className="mt-6">
        <Link href="/products">Shop Now</Link>
      </Button>
    </div>
  );
}
