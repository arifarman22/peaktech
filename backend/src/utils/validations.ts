import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password too long'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const verifyOTPSchema = z.object({
    email: z.string().email('Invalid email address'),
    otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const productSchema = z.object({
    name: z.string().min(1, 'Product name is required').max(200, 'Name cannot exceed 200 characters'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().min(1, 'Description is required').max(5000, 'Description too long'),
    price: z.number().min(0, 'Price cannot be negative'),
    compareAtPrice: z.number().min(0, 'Compare price cannot be negative').optional(),
    cost: z.number().min(0, 'Cost cannot be negative').optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    trackQuantity: z.boolean().default(true),
    quantity: z.number().min(0, 'Quantity cannot be negative').default(0),
    images: z.array(z.string()).default([]),
    category: z.string().min(1, 'Category is required'),
    tags: z.array(z.string()).optional(),
    status: z.enum(['active', 'draft', 'archived']).default('active'),
    featured: z.boolean().default(false),
});

export const categorySchema = z.object({
    name: z.string().min(1, 'Category name is required').max(50, 'Name cannot exceed 50 characters'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().max(500, 'Description too long').optional(),
    image: z.string().optional(),
    parent: z.string().optional(),
});

export const couponSchema = z.object({
    code: z.string().min(1, 'Coupon code is required').toUpperCase(),
    description: z.string().max(200, 'Description too long').optional(),
    discountType: z.enum(['percentage', 'fixed']),
    discountValue: z.number().min(0, 'Discount cannot be negative'),
    minimumPurchase: z.number().min(0, 'Minimum purchase cannot be negative').optional(),
    maxDiscount: z.number().min(0, 'Max discount cannot be negative').optional(),
    usageLimit: z.number().min(1, 'Usage limit must be at least 1').optional(),
    validFrom: z.string().or(z.date()),
    validUntil: z.string().or(z.date()),
    active: z.boolean().default(true),
});

export const checkoutSchema = z.object({
    shippingAddress: z.object({
        fullName: z.string().min(1, 'Full name is required'),
        addressLine1: z.string().min(1, 'Address is required'),
        addressLine2: z.string().optional(),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        postalCode: z.string().min(1, 'Postal code is required'),
        country: z.string().min(1, 'Country is required'),
        phone: z.string().min(1, 'Phone number is required'),
    }),
    paymentMethod: z.string().min(1, 'Payment method is required'),
    notes: z.string().optional(),
});
