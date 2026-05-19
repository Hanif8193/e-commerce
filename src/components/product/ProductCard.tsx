import Link from "next/link";
import Image from "next/image";
import { StockBadge } from "./StockBadge";
import { formatCurrency } from "@/utils/format";
import type { Decimal } from "@prisma/client/runtime/library";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: Decimal;
    images: string[];
    category: string;
    stock: number;
  };
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const imageUrl = product.images[0] ?? "https://placehold.co/400x400?text=No+Image";

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      aria-label={`${product.name} — ${formatCurrency(product.price)}`}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={priority}
        />
      </div>
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {product.category}
        </p>
        <h3 className="mt-1 text-sm font-semibold text-gray-900 line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-base font-bold text-gray-900">
            {formatCurrency(product.price)}
          </span>
          <StockBadge stock={product.stock} />
        </div>
      </div>
    </Link>
  );
}
