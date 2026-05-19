import type { ReactNode } from "react";

interface ShopLayoutProps {
  children: ReactNode;
}

export default function ShopLayout({ children }: ShopLayoutProps) {
  return <>{children}</>;
}
