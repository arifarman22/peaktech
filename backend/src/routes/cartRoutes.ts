import { Router } from 'express';
import { getCart, addToCart, clearCart } from '../controllers/cartController';
import { authMiddleware } from '../utils/middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getCart as any);
router.post('/', addToCart as any);
router.delete('/', clearCart as any);

export default router;
