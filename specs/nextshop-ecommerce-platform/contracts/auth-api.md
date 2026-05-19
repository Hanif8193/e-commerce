# API Contract: Authentication

**Base path**: `/api/auth/`
**Handler**: NextAuth v5 (`[...nextauth]/route.ts`)
**Auth required**: No (these ARE the auth endpoints)

---

## POST /api/auth/signup

Custom server action — not a NextAuth route.

**Request**
```json
{
  "email": "user@example.com",
  "password": "minimum8chars"
}
```

**Validation (Zod)**
```ts
z.object({
  email: z.string().email(),
  password: z.string().min(8),
})
```

**Responses**

| Status | Body | Condition |
|---|---|---|
| 201 | `{ "message": "Account created" }` | User created successfully |
| 400 | `{ "error": "Validation failed", "code": "VALIDATION_ERROR" }` | Invalid email or password too short |
| 409 | `{ "error": "Email already registered", "code": "EMAIL_EXISTS" }` | Duplicate email |
| 500 | `{ "error": "Internal server error", "code": "SERVER_ERROR" }` | Unexpected failure |

**Side effects**: Hashes password with bcrypt (cost factor 12); creates User record
with role `CUSTOMER`.

---

## POST /api/auth/callback/credentials (NextAuth)

Internal NextAuth endpoint. Triggered by `signIn("credentials", { email, password })`.

**Request** (form-encoded by NextAuth internally)
```
email=user@example.com&password=password123
```

**Responses**

| Status | Body | Condition |
|---|---|---|
| 302 | Redirect to `callbackUrl` | Credentials valid |
| 302 | Redirect to `/login?error=CredentialsSignin` | Credentials invalid |

---

## GET /api/auth/session (NextAuth)

Returns current session data for the authenticated user.

**Response (authenticated)**
```json
{
  "user": {
    "id": "cuid",
    "email": "user@example.com",
    "role": "CUSTOMER"
  },
  "expires": "2026-06-18T00:00:00.000Z"
}
```

**Response (unauthenticated)**
```json
null
```

---

## POST /api/auth/signout (NextAuth)

Clears the session cookie and redirects to `callbackUrl`.

---

## Error Taxonomy

| Code | Meaning |
|---|---|
| `VALIDATION_ERROR` | Input failed Zod schema validation |
| `EMAIL_EXISTS` | Email is already registered (signup) |
| `INVALID_CREDENTIALS` | Email/password combination not found (login) |
| `SERVER_ERROR` | Unexpected server-side failure — logged to Sentry |
