import { z } from "zod";

export const emailSchema = z.string().email("Invalid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const cuidSchema = z.string().cuid("Invalid ID format");

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const shippingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(3, "ZIP code is required"),
  country: z.string().length(2, "Country must be a 2-letter code"),
});

export const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(99),
});

export const orderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "FULFILLED", "CANCELLED"]),
});

const imageUrlSchema = z
  .string()
  .min(1)
  .refine(
    (s) => s.startsWith("/") || s.startsWith("http://") || s.startsWith("https://"),
    { message: "Must be a URL or an upload path starting with /" }
  );

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  price: z.number().positive(),
  images: z.array(imageUrlSchema).min(1),
  category: z.string().min(1),
  stock: z.number().int().nonnegative(),
});

export const updateProductSchema = createProductSchema.partial().extend({
  active: z.boolean().optional(),
});
