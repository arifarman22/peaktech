import { Request, Response } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';

export const createReview = async (req: Request, res: Response) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        const existingReview = await Review.findOne({ product: productId, user: userId });
        if (existingReview) {
            return res.status(400).json({ success: false, error: 'You have already reviewed this product' });
        }

        const review = await Review.create({
            product: productId,
            user: userId,
            rating,
            comment,
        });

        const populatedReview = await Review.findById(review._id).populate('user', 'name email');

        res.status(201).json({ success: true, data: populatedReview });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getProductReviews = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ product: productId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        res.json({
            success: true,
            data: {
                reviews,
                avgRating: Math.round(avgRating * 10) / 10,
                totalReviews: reviews.length,
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ success: false, error: 'Review not found' });
        }

        if (review.user.toString() !== userId) {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        await review.deleteOne();
        res.json({ success: true, message: 'Review deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
