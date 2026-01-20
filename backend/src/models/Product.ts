import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    cost?: number;
    sku?: string;
    barcode?: string;
    trackQuantity: boolean;
    quantity: number;
    images: string[];
    category: mongoose.Types.ObjectId;
    tags?: string[];
    status: 'active' | 'draft' | 'archived';
    featured: boolean;
    weight?: number;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };
    seo?: {
        title?: string;
        description?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [200, 'Product name cannot exceed 200 characters'],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
            maxlength: [5000, 'Description cannot exceed 5000 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        compareAtPrice: {
            type: Number,
            min: [0, 'Compare at price cannot be negative'],
        },
        cost: {
            type: Number,
            min: [0, 'Cost cannot be negative'],
        },
        sku: {
            type: String,
            trim: true,
        },
        barcode: {
            type: String,
            trim: true,
        },
        trackQuantity: {
            type: Boolean,
            default: true,
        },
        quantity: {
            type: Number,
            default: 0,
            min: [0, 'Quantity cannot be negative'],
        },
        images: {
            type: [String],
            default: [],
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },
        tags: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ['active', 'draft', 'archived'],
            default: 'active',
        },
        featured: {
            type: Boolean,
            default: false,
        },
        weight: {
            type: Number,
            min: [0, 'Weight cannot be negative'],
        },
        dimensions: {
            length: Number,
            width: Number,
            height: Number,
        },
        seo: {
            title: String,
            description: String,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
