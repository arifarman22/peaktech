import rateLimit from 'express-rate-limit';
import { errorResponse } from './api-response';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs for auth routes
    message: errorResponse('Too many attempts. Please try again after 15 minutes.'),
    standardHeaders: true,
    legacyHeaders: false,
});

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Limit each IP to 100 requests per windowMs for general API
    message: errorResponse('Too many requests. Please slow down.'),
    standardHeaders: true,
    legacyHeaders: false,
});
