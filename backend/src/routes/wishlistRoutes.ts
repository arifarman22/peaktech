import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController';
import { authMiddleware } from '../utils/middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getWishlist as any);
router.post('/', addToWishlist as any);
router.delete('/:productId', removeFromWishlist as any);

export default router;
