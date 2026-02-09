import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((error) => {
            console.error('Async handler caught error:', {
                endpoint: `${req.method} ${req.path}`,
                error: error.message,
                stack: error.stack,
                body: req.body,
                params: req.params,
                query: req.query
            });
            
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    error: 'Internal server error',
                    message: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        });
    };
};
