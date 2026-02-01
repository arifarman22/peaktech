import dotenv from 'dotenv';
// Load environment variables from backend/.env by default
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
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
import dashboardRoutes from './routes/dashboardRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import { loadEnv } from './config/env';

const app = express();
const env = loadEnv();
const PORT = Number(env.PORT) || 5000;

// Middleware
app.set('trust proxy', 1);
app.use(helmet());
app.use(
    cors({
        origin: (origin, callback) => {
            const allowed = [env.FRONTEND_URL ?? 'http://localhost:3000'];
            if (!origin || allowed.includes(origin)) return callback(null, true);
            return callback(new Error('Not allowed by CORS'));
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: false,
    })
);
app.use(express.json({ limit: '10mb' }));
app.use(apiLimiter);

// Routes
app.get('/', (req, res) => {
    res.send('PeakTech API is running...');
});

// Auth Routes (Placeholder - will migrate from Next.js)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/wishlist', wishlistRoutes);

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
