import mongoose, { Schema, Document, Model } from 'mongoose';

interface IOrderItem {
    product: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface IShippingAddress {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    orderNumber: string;
    items: IOrderItem[];
    shippingAddress: IShippingAddress;
    paymentMethod: string;
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    subtotal: number;
    tax: number;
    shippingCost: number;
    discount: number;
    total: number;
    couponCode?: string;
    notes?: string;
    trackingNumber?: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    image: String,
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
    fullName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },
        items: [OrderItemSchema],
        shippingAddress: {
            type: ShippingAddressSchema,
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
        },
        orderStatus: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
        tax: {
            type: Number,
            default: 0,
            min: 0,
        },
        shippingCost: {
            type: Number,
            default: 0,
            min: 0,
        },
        discount: {
            type: Number,
            default: 0,
            min: 0,
        },
        total: {
            type: Number,
            required: true,
            min: 0,
        },
        couponCode: String,
        notes: String,
        trackingNumber: String,
    },
    {
        timestamps: true,
    }
);

OrderSchema.index({ user: 1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
