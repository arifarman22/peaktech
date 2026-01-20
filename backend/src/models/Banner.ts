import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBanner extends Document {
    title: string;
    subtitle?: string;
    imageUrl: string;
    link?: string;
    active: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
    {
        title: {
            type: String,
            required: [true, 'Banner title is required'],
            trim: true,
        },
        subtitle: {
            type: String,
            trim: true,
        },
        imageUrl: {
            type: String,
            required: [true, 'Banner image URL is required'],
        },
        link: {
            type: String,
            default: '/shop',
        },
        active: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Banner: Model<IBanner> = mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema);

export default Banner;
