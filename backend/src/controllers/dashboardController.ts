import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const [orders, products, users] = await Promise.all([
            Order.find(),
            Product.find(),
            User.find()
        ]);

        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
        const recentOrders = await Order.find()
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            data: {
                stats: {
                    totalSales,
                    orderCount: orders.length,
                    productCount: products.length,
                    userCount: users.length
                },
                recentOrders
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
