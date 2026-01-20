import { Router } from 'express';
import { validateCoupon, getAdminCoupons, createCoupon } from '../controllers/couponController';
import { adminMiddleware, authMiddleware } from '../utils/middleware';

const router = Router();

router.post('/validate', authMiddleware, validateCoupon);
router.get('/admin', adminMiddleware, getAdminCoupons);
router.post('/admin', adminMiddleware, createCoupon);

export default router;
