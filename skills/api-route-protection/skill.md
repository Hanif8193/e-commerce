# Skill: API Route Protection

## Description
Patterns for securing Next.js API routes: authentication checks, input validation, rate limiting, consistent error responses, and preventing common API abuse patterns.

## When To Use
- When creating any new API route under `app/api/`
- When reviewing an existing API route for security gaps
- When a route handles sensitive data (user info, orders, payment, admin actions)
- When a route is experiencing abuse or unexpected traffic patterns

## Key Principles
- **Auth first**: check session before any other logic — fail fast with 401
- **Validate everything**: use Zod to validate request body, query params, and route params
- **Consistent error shape**: `{ error: string, code: string }` — never expose stack traces
- **HTTP semantics**: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error
- **Role check after auth**: 401 = not authenticated, 403 = authenticated but not authorized
- **Rate limit sensitive routes**: auth, checkout, and payment routes must have request rate limits

## Dependencies
- `next-auth` for session management
- `zod` for input validation
- Rate limiting library (e.g., `@upstash/ratelimit` with Redis, or in-memory for simple cases)

## Pitfalls To Avoid
- **Trusting `req.body` without validation**: user can send unexpected types — always parse with Zod
- **Missing role check**: authenticated user with wrong role can access admin endpoints
- **Exposing stack traces in 500 responses**: leaks internal architecture to attackers
- **No rate limiting on `/api/auth/`**: brute-force attacks on login
- **CORS misconfiguration**: allowing `*` origin on API routes that use cookies
