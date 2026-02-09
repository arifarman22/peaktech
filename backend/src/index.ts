import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
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
import reviewRoutes from './routes/reviewRoutes';
import { loadEnv } from './config/env';

const app = express();
const env = loadEnv();
const PORT = Number(env.PORT) || 5000;

// Middleware
app.set('trust proxy', 1);
app.use(helmet());

const allowedOrigins = [
    'http://localhost:3000',
    'https://peaktech-frontend.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Blocked origin:', origin);
            callback(null, true); // Allow all origins for now
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
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
                details: error.message
            });
        }
    }
    next();
};

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'PeakTech API is running', status: 'ok' });
});

app.get('/health', async (req, res) => {
    let dbStatus = 'not connected';
    try {
        if (mongoose.connection.readyState === 1) {
            dbStatus = 'connected';
        } else {
            await connectDB();
            dbStatus = 'connected after attempt';
        }
    } catch (error: any) {
        dbStatus = `error: ${error.message}`;
    }
    
    res.json({ 
        status: 'ok',
        db: dbStatus,
        env: {
            hasMongoUri: !!process.env.MONGODB_URI,
            mongoUriPreview: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 30) + '...' : 'NOT SET',
            hasJwtSecret: !!process.env.JWT_SECRET,
            nodeEnv: process.env.NODE_ENV
        }
    });
});

app.use('/api/auth', ensureDB, authRoutes);
app.use('/api/products', ensureDB, productRoutes);
app.use('/api/categories', ensureDB, categoryRoutes);
app.use('/api/cart', ensureDB, cartRoutes);
app.use('/api/orders', ensureDB, orderRoutes);
app.use('/api/banners', ensureDB, bannerRoutes);
app.use('/api/coupons', ensureDB, couponRoutes);
app.use('/api/admin', ensureDB, adminRoutes);
app.use('/api/admin/dashboard', ensureDB, dashboardRoutes);
app.use('/api/wishlist', ensureDB, wishlistRoutes);
app.use('/api/reviews', ensureDB, reviewRoutes);

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
    console.error('Error:', err);
    
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ success: false, error: 'CORS policy violation' });
    }
    
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ 
        success: false, 
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// Local server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    });
    connectDB();
}

export default app;
