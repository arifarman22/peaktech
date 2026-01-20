import { Request, Response } from 'express';
import Banner from '../models/Banner';
import { successResponse, errorResponse } from '../utils/api-response';

export const getBanners = async (req: Request, res: Response) => {
    try {
        const banners = await Banner.find({ active: true }).sort('order');
        return res.json(successResponse(banners));
    } catch (error) {
        return res.status(500).json(errorResponse('Failed to fetch banners'));
    }
};

export const getAllBanners = async (req: Request, res: Response) => {
    try {
        const banners = await Banner.find().sort('order');
        return res.json(successResponse(banners));
    } catch (error) {
        return res.status(500).json(errorResponse('Failed to fetch banners'));
    }
};

export const createBanner = async (req: Request, res: Response) => {
    try {
        const banner = await Banner.create(req.body);
        return res.status(201).json(successResponse(banner, 'Banner created successfully'));
    } catch (error) {
        return res.status(500).json(errorResponse('Failed to create banner'));
    }
};

export const updateBanner = async (req: Request, res: Response) => {
    try {
        const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!banner) return res.status(404).json(errorResponse('Banner not found'));
        return res.json(successResponse(banner, 'Banner updated successfully'));
    } catch (error) {
        return res.status(500).json(errorResponse('Failed to update banner'));
    }
};

export const deleteBanner = async (req: Request, res: Response) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) return res.status(404).json(errorResponse('Banner not found'));
        return res.json(successResponse(null, 'Banner deleted successfully'));
    } catch (error) {
        return res.status(500).json(errorResponse('Failed to delete banner'));
    }
};
