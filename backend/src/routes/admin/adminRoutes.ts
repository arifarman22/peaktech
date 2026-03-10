import { Router } from 'express';
import { getAdminOrders, updateOrderStatus, getDashboardStats, getCoupons, createCoupon, deleteCoupon } from '../../controllers/adminController';
import { uploadHandler } from '../../controllers/uploadController';
import { adminMiddleware } from '../../utils/middleware';

const router = Router();

import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../../controllers/productController';

router.use(adminMiddleware);

router.get('/orders', getAdminOrders);
router.put('/orders/:id', updateOrderStatus);
router.get('/dashboard', getDashboardStats);

router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.delete('/coupons/:id', deleteCoupon);

// Generic asset uploads (images, videos, files)
router.post('/uploads', uploadHandler);

// Admin product routes
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
