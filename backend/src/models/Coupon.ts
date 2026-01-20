import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICoupon extends Document {
    code: string;
    description?: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minimumPurchase?: number;
    maxDiscount?: number;
    usageLimit?: number;
    usageCount: number;
    validFrom: Date;
    validUntil: Date;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
    {
        code: {
            type: String,
            required: [true, 'Coupon code is required'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
            maxlength: [200, 'Description cannot exceed 200 characters'],
        },
        discountType: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: true,
        },
        discountValue: {
            type: Number,
            required: true,
            min: [0, 'Discount value cannot be negative'],
        },
        minimumPurchase: {
            type: Number,
            min: [0, 'Minimum purchase cannot be negative'],
            default: 0,
        },
        maxDiscount: {
            type: Number,
            min: [0, 'Max discount cannot be negative'],
        },
        usageLimit: {
            type: Number,
            min: [1, 'Usage limit must be at least 1'],
        },
        usageCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        validFrom: {
            type: Date,
            required: true,
        },
        validUntil: {
            type: Date,
            required: true,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

CouponSchema.index({ code: 1 });
CouponSchema.index({ active: 1 });

const Coupon: Model<ICoupon> =
    mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);

export default Coupon;
