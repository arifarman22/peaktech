import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db';
import { apiLimiter } from './utils/rate-limiter';
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
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: false,
}));
app.use(express.json({ limit: '10mb' }));
app.use(apiLimiter);

// Connect to DB
let dbConnected = false;
const ensureDB = async (req: any, res: any, next: any) => {
    if (!dbConnected) {
        try {
            await connectDB();
            dbConnected = true;
        } catch (error: any) {
            console.error('DB connection failed:', error.message);
            return res.status(503).json({ 
                success: false, 
                error: 'Service temporarily unavailable. Database connection failed.',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    next();
};

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'PeakTech API is running', status: 'ok' });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        env: {
            hasMongoUri: !!process.env.MONGODB_URI,
            mongoUriPreview: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 30) + '...' : 'NOT SET',
            hasJwtSecret: !!process.env.JWT_SECRET,
            nodeEnv: process.env.NODE_ENV
        }
    });
});

app.use('/api/auth', ensureDB, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', ensureDB, cartRoutes);
app.use('/api/orders', ensureDB, orderRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', ensureDB, adminRoutes);
app.use('/api/admin/dashboard', ensureDB, dashboardRoutes);
app.use('/api/wishlist', ensureDB, wishlistRoutes);

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
});

// Local server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    });
    connectDB();
}

export default app;
