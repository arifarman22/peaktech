import { Router } from 'express';
import { getBanners, getAllBanners, createBanner, updateBanner, deleteBanner } from '../controllers/bannerController';
import { adminMiddleware } from '../utils/middleware';

const router = Router();

// Public route
router.get('/active', getBanners);

// Admin routes
router.get('/', adminMiddleware, getAllBanners);
router.post('/', adminMiddleware, createBanner);
router.put('/:id', adminMiddleware, updateBanner);
router.delete('/:id', adminMiddleware, deleteBanner);

export default router;
