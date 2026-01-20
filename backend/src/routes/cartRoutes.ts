import { Router } from 'express';
import { getCart, addToCart } from '../controllers/cartController';
import { authMiddleware } from '../utils/middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getCart as any);
router.post('/', addToCart as any);

export default router;
