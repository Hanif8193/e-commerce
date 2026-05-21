import Link from "next/link";
import { type Session } from "next-auth";
import { Container } from "./Container";
import { SignOutButton } from "./SignOutButton";
import { getCartItemCount } from "@/services/cart.service";

interface NavbarProps {
  session: Session | null;
}

export async function Navbar({ session }: NavbarProps) {
  const cartCount = session ? await getCartItemCount(session.user.id) : 0;
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <Container>
        <nav
          className="flex h-16 items-center justify-between"
          aria-label="Main navigation"
        >
          <Link
            href="/products"
            className="text-xl font-bold text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded"
          >
            NextShop
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="text-sm text-gray-600 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
            >
              Shop
            </Link>

            {session ? (
              <>
                <Link
                  href="/cart"
                  className="relative text-sm text-gray-600 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
                  aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} item${cartCount !== 1 ? "s" : ""}` : ""}`}
                >
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/orders"
                  className="text-sm text-gray-600 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
                >
                  Orders
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-brand-600 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
                  >
                    Admin
                  </Link>
                )}
                <SignOutButton email={session.user.email} />
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              >
                Sign in
              </Link>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
}
