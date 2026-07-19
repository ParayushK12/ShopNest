import { z } from "zod";
import mongoose from "mongoose";
import fs from "fs/promises";

// Helper to validate MongoDB ObjectId
const objectIdSchema = z.string().refine(
  (val) => mongoose.Types.ObjectId.isValid(val),
  { message: "Invalid MongoDB ObjectId" }
);

// Generic validation middleware
export const validate = (schemas) => async (req, res, next) => {
  try {
    if (schemas.params) {
      req.params = schemas.params.parse(req.params);
    }
    if (schemas.query) {
      req.query = schemas.query.parse(req.query);
    }
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }
    if (schemas.file) {
      req.file = schemas.file.parse(req.file);
    }
    next();
  } catch (error) {
    // If a file was uploaded and validation fails, remove the temporary file to prevent storage leak
    if (req.file && req.file.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    next(error);
  }
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  console.error("errorHandler caught:", {
    name: err?.name,
    constructorName: err?.constructor?.name,
    message: err?.message,
    errors: err?.errors
  });

  if (err instanceof z.ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Handle Mongoose CastError (e.g. invalid ObjectIds before they hit our validator, or during DB operations)
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || "Internal server error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

// --- Schemas ---

// Auth
export const registerSchema = {
  body: z.object({
    name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
    email: z.string().trim().email("Invalid email format").max(255, "Email is too long"),
    password: z.string().min(6, "Password must be at least 6 characters long").max(100, "Password is too long"),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.string().trim().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
};

export const supportSchema = {
  body: z.object({
    name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
    email: z.string().trim().email("Invalid email format").max(255, "Email is too long"),
    message: z.string().trim().min(1, "Message is required").max(5000, "Message is too long"),
  }),
};

export const verifyOtpSchema = {
  body: z.object({
    email: z.string().trim().email("Invalid email format"),
    otp: z.string().trim().length(6, "OTP must be exactly 6 digits"),
  }),
};

export const resendOtpSchema = {
  body: z.object({
    email: z.string().trim().email("Invalid email format"),
  }),
};

// Products
export const productIdParamSchema = {
  params: z.object({
    id: objectIdSchema,
  }),
};

const priceSchema = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
  z.number({ invalid_type_error: "Price must be a number" }).min(0, "Price cannot be negative")
);

const stockSchema = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
  z.number({ invalid_type_error: "Stock must be a number" }).int("Stock must be an integer").min(0, "Stock cannot be negative")
);

export const createProductSchema = {
  body: z.object({
    name: z.string().trim().min(1, "Product name is required").max(200, "Product name is too long"),
    price: priceSchema,
    description: z.string().trim().min(1, "Product description is required"),
    category: z.string().trim().min(1, "Product category is required"),
    stock: stockSchema,
  }),
  file: z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string().refine(
      (val) => ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(val),
      { message: "Only JPEG, PNG, WEBP, and GIF images are allowed" }
    ),
    size: z.number().max(5 * 1024 * 1024, "Image size must be less than 5MB"),
    destination: z.string(),
    filename: z.string(),
    path: z.string(),
  }, { required_error: "Product image is required" }),
};

export const updateProductSchema = {
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    name: z.string().trim().min(1, "Product name cannot be empty").max(200).optional(),
    price: priceSchema.optional(),
    description: z.string().trim().min(1, "Product description cannot be empty").optional(),
    category: z.string().trim().min(1, "Product category cannot be empty").optional(),
    stock: stockSchema.optional(),
  }),
  file: z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string().refine(
      (val) => ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(val),
      { message: "Only JPEG, PNG, WEBP, and GIF images are allowed" }
    ),
    size: z.number().max(5 * 1024 * 1024, "Image size must be less than 5MB"),
    destination: z.string(),
    filename: z.string(),
    path: z.string(),
  }).optional(),
};

// Orders
export const createOrderSchema = {
  body: z.object({
    address: z.object({
      fullName: z.string().trim().min(1, "Full name is required").max(100),
      street: z.string().trim().min(1, "Street address is required").max(200),
      city: z.string().trim().min(1, "City is required").max(100),
      postalCode: z.string().trim().min(1, "Postal code is required").max(20),
      country: z.string().trim().min(1, "Country is required").max(100),
    }),
    totalAmount: z.number().min(0, "Total amount cannot be negative"),
    paymentId: z.string().trim().min(1, "Payment ID is required"),
    products: z.array(
      z.object({
        product: objectIdSchema,
        quantity: z.number().int().min(1, "Quantity must be at least 1"),
      })
    ).min(1, "Order must contain at least one product"),
  }),
};

export const orderIdParamSchema = {
  params: z.object({
    id: objectIdSchema,
  }),
};

export const updateOrderStatusSchema = {
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    status: z.enum(["pending", "shipped", "delivered"], {
      errorMap: () => ({ message: "Status must be pending, shipped, or delivered" }),
    }),
  }),
};

// Payments
export const createPaymentOrderSchema = {
  body: z.object({
    amount: z.number().min(0.01, "Amount must be at least 0.01"),
  }),
};

export const verifyPaymentSchema = {
  body: z.object({
    razorpay_order_id: z.string().trim().min(1, "Razorpay order ID is required"),
    razorpay_payment_id: z.string().trim().min(1, "Razorpay payment ID is required"),
    razorpay_signature: z.string().trim().min(1, "Razorpay signature is required"),
  }),
};
