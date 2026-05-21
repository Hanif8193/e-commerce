import { describe, it, expect } from "vitest";
import {
  signupSchema,
  shippingSchema,
  createProductSchema,
  addToCartSchema,
  updateCartItemSchema,
  orderStatusSchema,
} from "../validation";

describe("signupSchema", () => {
  it("accepts valid email and password", () => {
    expect(signupSchema.safeParse({ email: "test@example.com", password: "password123" }).success).toBe(true);
  });
  it("rejects invalid email", () => {
    expect(signupSchema.safeParse({ email: "not-an-email", password: "password123" }).success).toBe(false);
  });
  it("rejects password shorter than 8 chars", () => {
    expect(signupSchema.safeParse({ email: "test@example.com", password: "short" }).success).toBe(false);
  });
  it("accepts exactly 8-char password", () => {
    expect(signupSchema.safeParse({ email: "test@example.com", password: "exactly8" }).success).toBe(true);
  });
});

describe("shippingSchema", () => {
  const valid = {
    name: "Jane Doe",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "US",
  };

  it("accepts valid shipping data", () => {
    expect(shippingSchema.safeParse(valid).success).toBe(true);
  });
  it("rejects country longer than 2 chars", () => {
    expect(shippingSchema.safeParse({ ...valid, country: "USA" }).success).toBe(false);
  });
  it("rejects country shorter than 2 chars", () => {
    expect(shippingSchema.safeParse({ ...valid, country: "U" }).success).toBe(false);
  });
  it("rejects empty name", () => {
    expect(shippingSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
  });
  it("rejects missing zip", () => {
    expect(shippingSchema.safeParse({ ...valid, zip: "ab" }).success).toBe(false);
  });
});

describe("createProductSchema", () => {
  const valid = {
    name: "Test Product",
    description: "A great product",
    price: 29.99,
    images: ["https://example.com/img.jpg"],
    category: "electronics",
    stock: 10,
  };

  it("accepts valid product data", () => {
    expect(createProductSchema.safeParse(valid).success).toBe(true);
  });
  it("rejects zero price", () => {
    expect(createProductSchema.safeParse({ ...valid, price: 0 }).success).toBe(false);
  });
  it("rejects negative price", () => {
    expect(createProductSchema.safeParse({ ...valid, price: -5 }).success).toBe(false);
  });
  it("rejects empty images array", () => {
    expect(createProductSchema.safeParse({ ...valid, images: [] }).success).toBe(false);
  });
  it("rejects negative stock", () => {
    expect(createProductSchema.safeParse({ ...valid, stock: -1 }).success).toBe(false);
  });
  it("accepts zero stock", () => {
    expect(createProductSchema.safeParse({ ...valid, stock: 0 }).success).toBe(true);
  });
  it("accepts relative image paths", () => {
    expect(
      createProductSchema.safeParse({ ...valid, images: ["/uploads/img.jpg"] }).success
    ).toBe(true);
  });
});

describe("addToCartSchema", () => {
  it("accepts valid productId and quantity", () => {
    expect(addToCartSchema.safeParse({ productId: "abc123", quantity: 2 }).success).toBe(true);
  });
  it("rejects quantity of 0", () => {
    expect(addToCartSchema.safeParse({ productId: "abc123", quantity: 0 }).success).toBe(false);
  });
  it("rejects quantity over 99", () => {
    expect(addToCartSchema.safeParse({ productId: "abc123", quantity: 100 }).success).toBe(false);
  });
});

describe("updateCartItemSchema", () => {
  it("accepts valid quantity", () => {
    expect(updateCartItemSchema.safeParse({ quantity: 3 }).success).toBe(true);
  });
  it("rejects zero quantity", () => {
    expect(updateCartItemSchema.safeParse({ quantity: 0 }).success).toBe(false);
  });
});

describe("orderStatusSchema", () => {
  it("accepts valid statuses", () => {
    for (const status of ["PENDING", "PAID", "FULFILLED", "CANCELLED"]) {
      expect(orderStatusSchema.safeParse({ status }).success).toBe(true);
    }
  });
  it("rejects invalid status", () => {
    expect(orderStatusSchema.safeParse({ status: "SHIPPED" }).success).toBe(false);
  });
});
