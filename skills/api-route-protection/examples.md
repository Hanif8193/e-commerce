# API Route Protection — Examples

## Example 1: Fully Protected Admin Route
```ts
// app/api/admin/products/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
});

export async function POST(req: Request) {
  // 1. Auth check
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized", code: "UNAUTHENTICATED" }, { status: 401 });

  // 2. Role check
  if (session.user.role !== "ADMIN") {
    return Response.json({ error: "Forbidden", code: "INSUFFICIENT_ROLE" }, { status: 403 });
  }

  // 3. Input validation
  const body = await req.json();
  const result = createProductSchema.safeParse(body);
  if (!result.success) {
    return Response.json({ error: "Invalid input", code: "VALIDATION_ERROR", details: result.error.flatten() }, { status: 400 });
  }

  // 4. Business logic
  try {
    const product = await db.product.create({ data: result.data });
    return Response.json(product, { status: 201 });
  } catch {
    return Response.json({ error: "Internal server error", code: "SERVER_ERROR" }, { status: 500 });
  }
}
```

---

## Example 2: Rate Limiting with Upstash
```ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"), // 10 requests per minute
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = await ratelimit.limit(ip);
  if (!success) return Response.json({ error: "Too many requests", code: "RATE_LIMITED" }, { status: 429 });
  // ... handler logic
}
```

---

## Recovery: API Route Returning 500 in Production
```bash
# 1. Check Vercel function logs
vercel logs --follow

# 2. Check Sentry for the error stack trace
# (stack trace is in Sentry — NOT in the API response)

# 3. Reproduce locally
curl -X POST http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":9.99,"stock":10}'

# 4. Fix, deploy to preview, verify, merge
```
