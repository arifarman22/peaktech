import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from './auth';

export interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
}

/**
 * Middleware to verify JWT token and attach user to request
 */
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');
    const token = typeof authHeader === 'string' ? authHeader.replace('Bearer ', '') : null;

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const payload = verifyAccessToken(token);

    if (!payload) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = payload;
    next();
};

/**
 * Middleware to verify admin role
 */
export const adminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    authMiddleware(req, res, () => {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    });
};
