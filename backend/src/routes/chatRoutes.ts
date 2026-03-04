import { Router } from 'express';
import { chatWithAI, searchProducts } from '../controllers/chatController';

const router = Router();

router.post('/chat', chatWithAI);
router.post('/search', searchProducts);

export default router;
