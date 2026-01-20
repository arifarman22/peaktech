import { Request, Response } from 'express';
import Coupon from '../models/Coupon';
import { successResponse, errorResponse } from '../utils/api-response';

export const validateCoupon = async (req: Request, res: Response) => {
    try {
        const { code, orderAmount } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });

        if (!coupon) {
            return res.status(404).json(errorResponse('Invalid or inactive coupon code'));
        }

        // Check expiry
        if (new Date() > coupon.validUntil) {
            return res.status(400).json(errorResponse('Coupon has expired'));
        }

        // Check minimum purchase
        if (coupon.minimumPurchase && orderAmount < coupon.minimumPurchase) {
            return res.status(400).json(errorResponse(`Minimum purchase of $${coupon.minimumPurchase} required`));
        }

        // Check usage limit
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            return res.status(400).json(errorResponse('Coupon usage limit reached'));
        }

        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = (orderAmount * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
            }
        } else {
            discountAmount = coupon.discountValue;
        }

        return res.json(successResponse({
            code: coupon.code,
            discountAmount: Number(discountAmount.toFixed(2)),
            discountType: coupon.discountType
        }, 'Coupon applied successfully'));

    } catch (error) {
        return res.status(500).json(errorResponse('Failed to validate coupon'));
    }
};

export const getAdminCoupons = async (req: Request, res: Response) => {
    try {
        const coupons = await Coupon.find().sort('-createdAt');
        return res.json(successResponse(coupons));
    } catch (error) {
        return res.status(500).json(errorResponse('Failed to fetch coupons'));
    }
};

export const createCoupon = async (req: Request, res: Response) => {
    try {
        const coupon = await Coupon.create(req.body);
        return res.status(201).json(successResponse(coupon, 'Coupon created successfully'));
    } catch (error: any) {
        if (error.code === 11000) return res.status(400).json(errorResponse('Coupon code already exists'));
        return res.status(500).json(errorResponse('Failed to create coupon'));
    }
};
