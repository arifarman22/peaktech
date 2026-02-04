import { Response } from 'express';

/**
 * Consistent success response format
 */
export function successResponse(data: any, message: string = 'Success') {
    return {
        success: true,
        message,
        data,
    };
}

/**
 * Consistent error response format
 */
export function errorResponse(message: string = 'Error', details?: string) {
    return {
        success: false,
        error: message,
        ...(details ? { details } : {}),
    };
}
