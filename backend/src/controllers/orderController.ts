import { Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { AuthenticatedRequest } from '../utils/middleware';
import { checkoutSchema } from '../utils/validations';
import { successResponse, errorResponse } from '../utils/api-response';

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const validated = checkoutSchema.safeParse(req.body);

        if (!validated.success) {
            return res.status(400).json(errorResponse(validated.error.issues[0].message));
        }

        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json(errorResponse('Cart is empty'));
        }

        const subtotal = cart.items.reduce((sum, item: any) => sum + item.price * item.quantity, 0);
        const tax = subtotal * 0.1;
        const shippingCost = subtotal > 100 ? 0 : 10;
        const total = subtotal + tax + shippingCost;

        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const orderItems = cart.items.map((item: any) => ({
            product: item.product._id,
            name: item.product.name,
            price: item.price,
            quantity: item.quantity,
            image: item.product.images[0] || '',
        }));

        const order = await Order.create({
            user: userId,
            orderNumber,
            items: orderItems,
            shippingAddress: validated.data.shippingAddress,
            paymentMethod: validated.data.paymentMethod,
            subtotal,
            tax,
            shippingCost,
            total,
            notes: validated.data.notes,
        });

        // Update inventory
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            if (product && product.trackQuantity) {
                product.quantity -= item.quantity;
                await product.save();
            }
        }

        await Cart.findByIdAndDelete(cart._id);

        return res.status(201).json(successResponse(order, 'Order placed successfully'));
    } catch (error) {
        console.error('Create order error:', error);
        return res.status(500).json(errorResponse('Failed to process checkout'));
    }
};

export const getOrders = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const orders = await Order.find({ user: userId }).sort('-createdAt').lean();
        return res.json(successResponse({ orders }));
    } catch (error) {
        console.error('Get orders error:', error);
        return res.status(500).json(errorResponse('Failed to fetch orders'));
    }
};
