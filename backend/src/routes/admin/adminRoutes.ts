import { Router } from 'express';
import { getAdminOrders, updateOrderStatus, getDashboardStats, getCoupons, createCoupon, deleteCoupon } from '../../controllers/adminController';
import { adminMiddleware } from '../../utils/middleware';

const router = Router();

router.use(adminMiddleware);

router.get('/orders', getAdminOrders);
router.put('/orders/:id', updateOrderStatus);
router.get('/dashboard', getDashboardStats);

router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.delete('/coupons/:id', deleteCoupon);

export default router;
