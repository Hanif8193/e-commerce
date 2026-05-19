import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/format";
interface CartSummaryProps {
  items: Array<{
    quantity: number;
    product: { price: number };
  }>;
}

export function CartSummary({ items }: CartSummaryProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
      <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4">
        <div className="flex justify-between font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
      </div>

      <Button asChild className="mt-6 w-full">
        <Link href="/checkout">Proceed to Checkout</Link>
      </Button>
    </div>
  );
}
