import { Router } from 'express';
import { getProducts, getProductBySlug, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { adminMiddleware } from '../utils/middleware';

const router = Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.get('/id/:id', getProductById);
router.post('/', adminMiddleware, createProduct);
router.put('/:id', adminMiddleware, updateProduct);
router.delete('/:id', adminMiddleware, deleteProduct);

export default router;
