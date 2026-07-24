import { z } from "zod";

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

// Category Schema
export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
});

// Product Schema
export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  salePrice: z.number().optional().nullable(),
  images: z.array(z.string().url("Must be valid URL")).min(1, "At least one image is required"),
  sizes: z.array(z.string()),
  sizeChartUrl: z.string().url("Must be valid URL").optional().nullable(),
  details: z.any().optional().nullable(),
  stock: z.number().int().min(0, "Stock cannot be negative").optional().default(0),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  categoryId: z.string(),
}).refine(data => {
  if (data.isFeatured) {
    if (data.name.trim().length < 5) return false;
    const placeholderPattern = /^(test|placeholder|kuch\s*b|demo|asdf|xyz|temp|dummy|abc)$/i;
    if (placeholderPattern.test(data.name.trim())) return false;
  }
  return true;
}, {
  message: "Featured/Trending products must have a real product name (at least 5 characters, no placeholders) and valid images",
  path: ["name"]
});

// Order Schemas
export const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  size: z.string().optional(),
});

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Order must contain at least one item"),
  totalAmount: z.number().positive(),
  paymentMethod: z.enum(["COD", "ONLINE"]),
  deliveryAddress: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  phone: z.string().min(10, "Valid phone number required"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export const customOrderSchema = orderSchema.extend({
  measurements: z.object({
    chest: z.number().positive(),
    waist: z.number().positive(),
    hips: z.number().positive(),
    length: z.number().positive(),
    sleeves: z.number().positive(),
  }),
  fabricChoice: z.string().min(2, "Fabric choice is required"),
  specialInstructions: z.string().optional(),
});
