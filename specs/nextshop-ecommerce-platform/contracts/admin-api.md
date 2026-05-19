# API Contract: Admin

**Base path**: `/api/admin/`
**Auth required**: Yes — authenticated session with `role === "ADMIN"` on EVERY endpoint.
**Double gate**: Middleware blocks non-ADMIN at route level; handler re-checks role as
second defence layer.
**Caching**: None — all dynamic

---

## GET /api/admin/products

Returns all products including inactive ones (for admin management).

**Query Parameters**
| Param | Type | Required | Description |
|---|---|---|---|
| `page` | number | No | Default 1 |
| `limit` | number | No | Default 20, max 100 |
| `active` | boolean | No | Filter by active status |
| `category` | string | No | Filter by category |

**Response 200**
```json
{
  "products": [
    {
      "id": "cuid",
      "name": "Classic White Tee",
      "price": "29.99",
      "category": "clothing",
      "stock": 42,
      "active": true,
      "createdAt": "2026-05-18T00:00:00.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 150, "totalPages": 8 }
}
```

---

## POST /api/admin/products

Creates a new product. See `products-api.md` for schema — same validation.

**Response 201**: Full product object.

---

## PUT /api/admin/products/[id]

Updates an existing product. All fields optional (partial update).

**Response 200**: Updated full product object.

**Error Responses**
| Status | Code | Condition |
|---|---|---|
| 404 | `NOT_FOUND` | Product ID does not exist |

---

## DELETE /api/admin/products/[id]

Soft-deletes a product (`active = false`).

**Constraint**: If product has associated `OrderItem` records, hard delete is
PROHIBITED. Soft delete is always safe.

**Response 200**
```json
{ "message": "Product deactivated", "id": "cuid", "hadOrders": false }
```

---

## GET /api/admin/orders

Returns ALL orders across all users. Ordered by `createdAt` descending.

**Query Parameters**
| Param | Type | Required | Description |
|---|---|---|---|
| `page` | number | No | Default 1 |
| `limit` | number | No | Default 20 |
| `status` | string | No | Filter: PENDING, PAID, FULFILLED, CANCELLED |

**Response 200**
```json
{
  "orders": [
    {
      "id": "order-cuid",
      "status": "PAID",
      "total": "89.97",
      "createdAt": "2026-05-18T12:00:00.000Z",
      "user": { "email": "customer@nextshop.com" },
      "itemCount": 3
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 47, "totalPages": 3 }
}
```

---

## PUT /api/admin/orders/[id]

Updates order status (e.g., mark as FULFILLED or CANCELLED).

**Request**
```json
{ "status": "FULFILLED" }
```

**Validation**
```ts
z.object({
  status: z.enum(["PENDING", "PAID", "FULFILLED", "CANCELLED"]),
})
```

**Response 200**: Updated order object.

---

## Error Taxonomy (all admin routes)

| Status | Code | Condition |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Schema validation failure |
| 401 | `UNAUTHENTICATED` | No valid session |
| 403 | `INSUFFICIENT_ROLE` | Session exists but role != ADMIN |
| 404 | `NOT_FOUND` | Resource not found |
| 500 | `SERVER_ERROR` | DB failure — logged to Sentry |

**Note**: Stack traces MUST NEVER appear in any error response body.
