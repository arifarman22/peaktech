import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parent?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
            maxlength: [50, 'Category name cannot exceed 50 characters'],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
        image: {
            type: String,
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

CategorySchema.index({ slug: 1 });
CategorySchema.index({ parent: 1 });

const Category: Model<ICategory> =
    mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
