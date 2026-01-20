import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import Coupon from '../models/Coupon';
import { successResponse, errorResponse } from '../utils/api-response';

export const getAdminOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate('user', 'name email')
            .lean();
        return res.json(successResponse(orders));
    } catch (error) {
        return res.status(500).json(errorResponse('Failed to fetch orders'));
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { orderStatus, paymentStatus } = req.body;

        const order = await Order.findByIdAndUpdate(
            id,
            { orderStatus, paymentStatus },
            { new: true }
        );

        if (!order) return res.status(404).json(errorResponse('Order not found'));

        return res.json(successResponse(order, 'Order updated successfully'));
    } catch (error) {
        return res.status(500).json(errorResponse('Failed to update order'));
    }
};

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalSales = await Order.aggregate([
            { $match: { orderStatus: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        const orderCount = await Order.countDocuments();
        const productCount = await Product.countDocuments();
        const userCount = await User.countDocuments();

        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name');

        return res.json(successResponse({
            stats: {
                totalSales: totalSales[0]?.total || 0,
                orderCount,
                productCount,
                userCount
            },
            recentOrders
        }));
    } catch (error) {
        return res.status(500).json(errorResponse('Failed to fetch dashboard stats'));
    }
};

export const getCoupons = async (req: Request, res: Response) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        return res.json(successResponse(coupons));
    } catch (error) {
        return res.status(500).json(errorResponse('Failed to fetch coupons'));
    }
};

export const createCoupon = async (req: Request, res: Response) => {
    try {
        const { code, discountType, discountAmount, minOrderAmount, expiryDate } = req.body;
        const coupon = await Coupon.create({
            code,
            discountType,
            discountValue: discountAmount,
            minimumPurchase: minOrderAmount,
            validFrom: new Date(),
            validUntil: expiryDate ? new Date(expiryDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
        });
        return res.status(201).json(successResponse(coupon, 'Coupon created successfully'));
    } catch (error: any) {
        if (error.code === 11000) return res.status(400).json(errorResponse('Coupon code already exists'));
        return res.status(500).json(errorResponse('Failed to create coupon'));
    }
};

export const deleteCoupon = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Coupon.findByIdAndDelete(id);
        return res.json(successResponse(null, 'Coupon deleted successfully'));
    } catch (error) {
        return res.status(500).json(errorResponse('Failed to delete coupon'));
    }
};
