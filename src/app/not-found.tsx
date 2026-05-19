import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-brand-600">404</p>
      <h2 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h2>
      <p className="mt-2 text-gray-500">
        The page you are looking for does not exist.
      </p>
      <Button asChild className="mt-6">
        <Link href="/products">Browse Products</Link>
      </Button>
    </div>
  );
}
