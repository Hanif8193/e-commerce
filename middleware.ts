import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Admin gate: authenticated but not ADMIN
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      if (token?.role !== "ADMIN") {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { error: "Forbidden", code: "INSUFFICIENT_ROLE" },
            { status: 403 }
          );
        }
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Public paths — no token required
        const publicPaths = ["/", "/login", "/signup", "/api/auth"];
        if (publicPaths.some((p) => pathname.startsWith(p))) return true;
        // Product listing/detail — public
        if (pathname.startsWith("/products") && !pathname.startsWith("/api/admin")) return true;
        if (pathname.startsWith("/api/products") && req.method === "GET") return true;
        // Health check — public
        if (pathname === "/api/health") return true;
        // Stripe webhook — public (verified by signature)
        if (pathname === "/api/webhooks/stripe") return true;
        // All other paths require a token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
