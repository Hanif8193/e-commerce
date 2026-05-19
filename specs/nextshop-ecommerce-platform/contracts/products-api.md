# API Contract: Products

**Base path**: `/api/products/`
**Auth required**: No (read); Yes + ADMIN role (write)
**Caching**: GET endpoints use ISR (`revalidate: 60`) at the page level —
             these API routes return fresh data; caching is page-level only.

---

## GET /api/products

Returns paginated list of active products.

**Query Parameters**
| Param | Type | Required | Description |
|---|---|---|---|
| `page` | number | No | Page number, default 1 |
| `limit` | number | No | Items per page, default 20, max 100 |
| `category` | string | No | Filter by category slug |

**Response 200**
```json
{
  "products": [
    {
      "id": "cuid",
      "name": "Classic White Tee",
      "price": "29.99",
      "images": ["https://cdn.example.com/img1.jpg"],
      "category": "clothing",
      "stock": 42,
      "active": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 84,
    "totalPages": 5
  }
}
```

**Error Responses**
| Status | Code | Condition |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Invalid query param type |
| 500 | `SERVER_ERROR` | DB failure |

---

## GET /api/products/[id]

Returns full product detail by ID.

**Response 200**
```json
{
  "id": "cuid",
  "name": "Classic White Tee",
  "description": "100% organic cotton...",
  "price": "29.99",
  "images": ["url1", "url2"],
  "category": "clothing",
  "stock": 42,
  "active": true,
  "createdAt": "2026-05-18T00:00:00.000Z"
}
```

**Error Responses**
| Status | Code | Condition |
|---|---|---|
| 404 | `NOT_FOUND` | Product ID does not exist or `active: false` |
| 500 | `SERVER_ERROR` | DB failure |

---

## POST /api/products *(Admin only)*

Creates a new product.

**Auth**: Session required + `role === "ADMIN"`.

**Request**
```json
{
  "name": "Classic White Tee",
  "description": "100% organic cotton tee.",
  "price": 29.99,
  "images": ["https://cdn.example.com/img1.jpg"],
  "category": "clothing",
  "stock": 100
}
```

**Validation (Zod)**
```ts
z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  price: z.number().positive(),
  images: z.array(z.string().url()).min(1),
  category: z.string().min(1),
  stock: z.number().int().nonnegative(),
})
```

**Response 201**
```json
{ "id": "cuid", "name": "Classic White Tee", ...fullProduct }
```

**Error Responses**
| Status | Code | Condition |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Schema validation failure |
| 401 | `UNAUTHENTICATED` | No session |
| 403 | `INSUFFICIENT_ROLE` | Session exists but role != ADMIN |
| 500 | `SERVER_ERROR` | DB failure |

---

## PUT /api/products/[id] *(Admin only)*

Updates an existing product. Partial update supported.

**Request** (all fields optional)
```json
{
  "price": 24.99,
  "stock": 50
}
```

**Response 200**: Updated full product object.

**Error Responses**: Same as POST + `404 NOT_FOUND`.

---

## DELETE /api/products/[id] *(Admin only)*

Soft-deletes a product (`active = false`). Hard delete is never performed
if the product has associated OrderItems.

**Response 200**
```json
{ "message": "Product deactivated", "id": "cuid" }
```

**Error Responses**
| Status | Code | Condition |
|---|---|---|
| 401 | `UNAUTHENTICATED` | No session |
| 403 | `INSUFFICIENT_ROLE` | Not admin |
| 404 | `NOT_FOUND` | Product not found |
| 500 | `SERVER_ERROR` | DB failure |
