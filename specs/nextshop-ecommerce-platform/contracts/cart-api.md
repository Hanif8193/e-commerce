# API Contract: Shopping Cart

**Base path**: `/api/cart/`
**Auth required**: Yes (all endpoints — cart belongs to authenticated user)
**Caching**: None — all responses are dynamic (`cache: 'no-store'`)

---

## GET /api/cart

Returns the authenticated user's cart with all items and totals.

**Response 200**
```json
{
  "id": "cart-cuid",
  "items": [
    {
      "id": "cartitem-cuid",
      "quantity": 2,
      "product": {
        "id": "product-cuid",
        "name": "Classic White Tee",
        "price": "29.99",
        "images": ["https://cdn.example.com/img1.jpg"],
        "stock": 40
      },
      "lineTotal": "59.98"
    }
  ],
  "subtotal": "59.98",
  "itemCount": 2
}
```

**Response 200 (empty cart)**
```json
{ "id": null, "items": [], "subtotal": "0.00", "itemCount": 0 }
```

**Error Responses**
| Status | Code | Condition |
|---|---|---|
| 401 | `UNAUTHENTICATED` | No valid session |
| 500 | `SERVER_ERROR` | DB failure |

---

## POST /api/cart

Adds a product to cart. If the product is already in the cart, increments
quantity. If no cart exists for this user, creates one.

**Request**
```json
{
  "productId": "product-cuid",
  "quantity": 1
}
```

**Validation (Zod)**
```ts
z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().min(1).max(99),
})
```

**Response 201**
```json
{
  "cartItem": {
    "id": "cartitem-cuid",
    "quantity": 1,
    "productId": "product-cuid"
  }
}
```

**Error Responses**
| Status | Code | Condition |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Invalid productId or quantity |
| 400 | `OUT_OF_STOCK` | Product stock < requested quantity |
| 401 | `UNAUTHENTICATED` | No session |
| 404 | `PRODUCT_NOT_FOUND` | Product does not exist or inactive |
| 500 | `SERVER_ERROR` | DB failure |

---

## PUT /api/cart/[itemId]

Updates the quantity of a specific cart item.

**Request**
```json
{ "quantity": 3 }
```

**Validation (Zod)**
```ts
z.object({ quantity: z.number().int().min(1).max(99) })
```

**Response 200**
```json
{ "id": "cartitem-cuid", "quantity": 3 }
```

**Error Responses**
| Status | Code | Condition |
|---|---|---|
| 400 | `VALIDATION_ERROR` | quantity < 1 or non-integer |
| 400 | `OUT_OF_STOCK` | Requested qty exceeds current stock |
| 401 | `UNAUTHENTICATED` | No session |
| 403 | `FORBIDDEN` | Cart item belongs to different user |
| 404 | `NOT_FOUND` | Cart item ID not found |

---

## DELETE /api/cart/[itemId]

Removes a specific item from the cart entirely.

**Response 200**
```json
{ "message": "Item removed", "id": "cartitem-cuid" }
```

**Error Responses**
| Status | Code | Condition |
|---|---|---|
| 401 | `UNAUTHENTICATED` | No session |
| 403 | `FORBIDDEN` | Cart item belongs to different user |
| 404 | `NOT_FOUND` | Cart item ID not found |

---

## Implementation Notes

- Cart is created lazily: `db.cart.upsert({ where: { userId }, create: { userId }, update: {} })`
- CartItem upsert: `db.cartItem.upsert({ where: { cartId_productId: { cartId, productId } }, create: ..., update: { quantity: { increment: qty } } })`
- Stock check: performed at add/update time as a soft guard; hard guard happens
  at checkout via atomic transaction
