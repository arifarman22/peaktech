import { Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { AuthenticatedRequest } from '../utils/middleware';
import { successResponse, errorResponse } from '../utils/api-response';

export const getCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        let cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }

        // Calculate total
        const total = cart.items.reduce((sum, item: any) => sum + item.price * item.quantity, 0);

        return res.json(successResponse({ items: cart.items, total }));
    } catch (error) {
        console.error('Get cart error:', error);
        return res.status(500).json(errorResponse('Failed to fetch cart'));
    }
};

export const addToCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json(errorResponse('Product not found'));

        if (product.trackQuantity && product.quantity < quantity) {
            return res.status(400).json(errorResponse('Not enough stock'));
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
            cart.items[itemIndex].price = product.price; // Update to latest price
        } else {
            cart.items.push({
                product: productId,
                quantity,
                price: product.price,
            });
        }

        await cart.save();
        return res.json(successResponse(cart, 'Item added to cart'));
    } catch (error) {
        console.error('Add to cart error:', error);
        return res.status(500).json(errorResponse('Failed to add to cart'));
    }
};

export const clearCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        await Cart.findOneAndUpdate({ user: userId }, { items: [] });
        return res.json(successResponse(null, 'Cart cleared'));
    } catch (error) {
        console.error('Clear cart error:', error);
        return res.status(500).json(errorResponse('Failed to clear cart'));
    }
};
