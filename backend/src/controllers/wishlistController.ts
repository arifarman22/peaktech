import { Response } from 'express';
import Wishlist from '../models/Wishlist';
import Product from '../models/Product';
import { AuthenticatedRequest } from '../utils/middleware';
import { successResponse, errorResponse } from '../utils/api-response';

export const getWishlist = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        let wishlist = await Wishlist.findOne({ user: userId }).populate('products');

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, products: [] });
        }

        return res.json(successResponse({ products: wishlist.products }));
    } catch (error) {
        console.error('Get wishlist error:', error);
        return res.status(500).json(errorResponse('Failed to fetch wishlist'));
    }
};

export const addToWishlist = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { productId } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json(errorResponse('Product not found'));

        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, products: [] });
        }

        if (wishlist.products.includes(productId)) {
            return res.status(400).json(errorResponse('Product already in wishlist'));
        }

        wishlist.products.push(productId);
        await wishlist.save();

        return res.json(successResponse(wishlist, 'Added to wishlist'));
    } catch (error) {
        console.error('Add to wishlist error:', error);
        return res.status(500).json(errorResponse('Failed to add to wishlist'));
    }
};

export const removeFromWishlist = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            return res.status(404).json(errorResponse('Wishlist not found'));
        }

        wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
        await wishlist.save();

        return res.json(successResponse(null, 'Removed from wishlist'));
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        return res.status(500).json(errorResponse('Failed to remove from wishlist'));
    }
};
