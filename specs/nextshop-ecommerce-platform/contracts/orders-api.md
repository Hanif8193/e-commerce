# API Contract: Orders

**Base path**: `/api/orders/`
**Auth required**: Yes (all endpoints — orders are user-scoped)
**Caching**: None — all dynamic

---

## GET /api/orders

Returns all orders belonging to the authenticated user. Ordered by `createdAt` descending.

**Query Parameters**
| Param | Type | Required | Description |
|---|---|---|---|
| `page` | number | No | Page number, default 1 |
| `limit` | number | No | Items per page, default 10, max 50 |

**Response 200**
```json
{
  "orders": [
    {
      "id": "order-cuid",
      "status": "PAID",
      "total": "89.97",
      "createdAt": "2026-05-18T12:00:00.000Z",
      "itemCount": 3
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}
```

**Response 200 (no orders)**
```json
{ "orders": [], "pagination": { "page": 1, "limit": 10, "total": 0, "totalPages": 0 } }
```

**Security**: Query MUST include `where: { userId: session.user.id }` — no cross-user
data may be returned under any circumstances (FR-021).

**Error Responses**
| Status | Code | Condition |
|---|---|---|
| 401 | `UNAUTHENTICATED` | No valid session |
| 500 | `SERVER_ERROR` | DB failure |

---

## GET /api/orders/[id]

Returns full detail of a single order including all items.

**Response 200**
```json
{
  "id": "order-cuid",
  "status": "PAID",
  "total": "89.97",
  "createdAt": "2026-05-18T12:00:00.000Z",
  "items": [
    {
      "id": "orderitem-cuid",
      "quantity": 2,
      "unitPrice": "29.99",
      "lineTotal": "59.98",
      "product": {
        "id": "product-cuid",
        "name": "Classic White Tee",
        "images": ["https://cdn.example.com/img1.jpg"]
      }
    }
  ],
  "payment": {
    "status": "SUCCEEDED",
    "amount": "89.97"
  }
}
```

**Security**: Server MUST verify `order.userId === session.user.id` before returning.
Return 404 (not 403) if the order ID exists but belongs to another user — do not
reveal the existence of other users' orders.

**Error Responses**
| Status | Code | Condition |
|---|---|---|
| 401 | `UNAUTHENTICATED` | No session |
| 404 | `NOT_FOUND` | Order not found OR belongs to different user |
| 500 | `SERVER_ERROR` | DB failure |

---

## Order Status Reference

| Status | Meaning |
|---|---|
| `PENDING` | PaymentIntent created — webhook not yet received |
| `PAID` | Payment webhook confirmed — order is active |
| `FULFILLED` | Order shipped/completed (admin action) |
| `CANCELLED` | Order cancelled (admin or system action) |
