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
export function errorResponse(message: string = 'Error', code: number = 400) {
    return {
        success: false,
        error: message,
    };
}
