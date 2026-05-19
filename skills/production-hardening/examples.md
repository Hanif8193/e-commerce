# Production Hardening — Examples

## Example 1: Security Headers in next.config.ts
```ts
// next.config.ts
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};
export default nextConfig;
```

---

## Example 2: Health Check Endpoint
```ts
// app/api/health/route.ts
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok", db: "connected" });
  } catch {
    return Response.json({ status: "error", db: "disconnected" }, { status: 503 });
  }
}
```

---

## Example 3: Sentry with PII Scrubbing
```ts
// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  beforeSend(event) {
    // Remove user email from all events
    if (event.user) delete event.user.email;
    return event;
  },
});
```

---

## Recovery: Production Crash (Blank Page)
```
1. Check Sentry for the uncaught error — get the stack trace
2. Confirm app/error.tsx exists and is rendering correctly
3. If blank page: error.tsx itself may have an error — simplify it to a static message
4. Roll back via Vercel if the issue is widespread
5. Fix error boundary; test on preview; redeploy
```
