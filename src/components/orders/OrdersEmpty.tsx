import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function OrdersEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-lg font-medium text-gray-900">No orders yet</p>
      <p className="mt-1 text-sm text-gray-500">
        Your order history will appear here after your first purchase.
      </p>
      <Button asChild className="mt-6">
        <Link href="/products">Start Shopping</Link>
      </Button>
    </div>
  );
}
