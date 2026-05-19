export type ProductStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  active: boolean;
}

export interface CartItemWithProduct {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
}

export interface CartWithItems {
  id: string;
  items: CartItemWithProduct[];
}

export interface OrderSummaryType {
  id: string;
  status: "PENDING" | "PAID" | "FULFILLED" | "CANCELLED";
  total: number;
  createdAt: Date;
  itemCount: number;
}

export interface ApiError {
  error: string;
  code: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
