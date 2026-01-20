import dotenv from 'dotenv';
// Load environment variables immediately after importing dotenv
dotenv.config({ path: '../frontend/.env.local' });

import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import { apiLimiter, authLimiter } from './utils/rate-limiter';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import bannerRoutes from './routes/bannerRoutes';
import couponRoutes from './routes/couponRoutes';
import adminRoutes from './routes/admin/adminRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(apiLimiter);

// Routes
app.get('/', (req, res) => {
    res.send('PeakTech API is running...');
});

// Auth Routes (Placeholder - will migrate from Next.js)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // Placeholder - will migrate from Next.js
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);

// Start Server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Backend server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();
