import { Router } from 'express';
import { createOrder, getOrders, deleteOrder } from '../controllers/orderController';
import { authMiddleware } from '../utils/middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createOrder as any);
router.get('/', getOrders as any);
router.delete('/:id', deleteOrder as any);

export default router;
