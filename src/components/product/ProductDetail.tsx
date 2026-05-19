import { ProductImageGallery } from "./ProductImageGallery";
import { StockBadge } from "./StockBadge";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { formatCurrency } from "@/utils/format";
import type { Decimal } from "@prisma/client/runtime/library";

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: Decimal;
    images: string[];
    category: string;
    stock: number;
  };
}

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
      <ProductImageGallery images={product.images} productName={product.name} />

      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-400">
            {product.category}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            {product.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(product.price)}
          </span>
          <StockBadge stock={product.stock} />
        </div>

        <p className="text-base leading-relaxed text-gray-600">
          {product.description}
        </p>

        <div className="mt-2">
          <AddToCartButton productId={product.id} stock={product.stock} />
        </div>
      </div>
    </div>
  );
}
