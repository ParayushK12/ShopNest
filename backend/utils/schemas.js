import { z } from 'zod';

const mongoId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid resource ID.');
const text = (label, min, max) => z.string().trim().min(min, `${label} is required.`).max(max, `${label} is too long.`);
const numberFromForm = (label) => z.preprocess((value) => value === '' ? undefined : Number(value), z.number({ error: `${label} must be a number.` }).finite().min(0, `${label} cannot be negative.`));

export const registerSchema = z.object({
  name: text('Name', 2, 80),
  email: z.string().trim().email('Enter a valid email address.').max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(8, 'Password must be at least 8 characters.').max(128).regex(/[A-Za-z]/, 'Password must include a letter.').regex(/\d/, 'Password must include a number.'),
}).strict();

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.').max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(1, 'Password is required.').max(128),
}).strict();

export const productSchema = z.object({
  name: text('Product name', 2, 120),
  price: numberFromForm('Price').max(1_000_000, 'Price is too high.'),
  description: text('Description', 10, 4000),
  category: z.enum(['T-Shirts', 'Shirts', 'Polo Shirts', 'Tops', 'Skirts', 'Denims']),
  stock: numberFromForm('Stock').int('Stock must be a whole number.').max(100_000, 'Stock is too high.'),
}).strict();

export const idParamSchema = z.object({ id: mongoId });

export const addressSchema = z.object({
  fullName: text('Full name', 2, 100), street: text('Street', 4, 200), city: text('City', 2, 80),
  postalCode: z.string().trim().min(3, 'Enter a valid postal code.').max(16, 'Postal code is too long.'), country: text('Country', 2, 80),
}).strict();

export const paymentOrderSchema = z.object({
  amount: z.number().positive('Amount must be positive.').max(10_000_000, 'Amount is too high.'),
}).strict();

export const createOrderSchema = z.object({
  products: z.array(z.object({ product: mongoId, quantity: z.number().int().min(1).max(20) }).strict()).min(1).max(20),
  address: addressSchema,
  totalAmount: z.number().finite().nonnegative('Total amount cannot be negative.').max(10_000_000, 'Total amount is too high.'),
  paymentId: z.string().min(1, 'Payment ID is required.').max(100),
}).strict();

export const paymentVerifySchema = z.object({
  razorpay_order_id: z.string().min(1).max(100), razorpay_payment_id: z.string().min(1).max(100), razorpay_signature: z.string().length(64),
}).strict();

export const orderStatusSchema = z.object({ status: z.enum(['pending', 'shipped', 'delivered']) }).strict();
