# Auth Stability — Examples

## Example 1: Server-Side Session Check (API Route)
```ts
// app/api/orders/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await db.order.findMany({ where: { userId: session.user.id } });
  return Response.json(orders);
}
```

---

## Example 2: Middleware Route Protection
```ts
// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "ADMIN";
      }
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/checkout/:path*"],
};
```

---

## Example 3: Extending Session Type
```ts
// types/auth.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: { id: string; role: "CUSTOMER" | "ADMIN" } & DefaultSession["user"];
  }
}
```

---

## Recovery: All Users Signed Out After Secret Rotation
```
1. This is expected behavior — session invalidation is intentional on secret rotation
2. Communicate to users: "Please sign in again"
3. Verify new NEXTAUTH_SECRET is set correctly in Vercel
4. Redeploy to ensure the new secret is active
5. Test sign-in flow end-to-end on preview before promoting to production
```
