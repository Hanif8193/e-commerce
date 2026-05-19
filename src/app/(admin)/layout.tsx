import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <Container>
          <div className="flex h-14 items-center gap-6">
            <span className="font-bold text-gray-900">Admin</span>
            <Link
              href="/admin"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Orders
            </Link>
            <Link
              href="/admin/account"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Account
            </Link>
          </div>
        </Container>
      </nav>
      <div>{children}</div>
    </div>
  );
}
