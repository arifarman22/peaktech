import rateLimit from 'express-rate-limit';
import { errorResponse } from './api-response';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 requests per windowMs for auth routes
    message: errorResponse('Too many attempts. Please try again after 15 minutes.'),
    standardHeaders: true,
    legacyHeaders: false,
});

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500, // Limit each IP to 500 requests per windowMs for general API
    message: errorResponse('Too many requests. Please slow down.'),
    standardHeaders: true,
    legacyHeaders: false,
});
