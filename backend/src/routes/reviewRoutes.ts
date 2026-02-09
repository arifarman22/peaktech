import express from 'express';
import { createReview, getProductReviews, deleteReview } from '../controllers/reviewController';
import { authMiddleware } from '../utils/middleware';

const router = express.Router();

router.post('/', authMiddleware, createReview);
router.get('/product/:productId', getProductReviews);
router.delete('/:id', authMiddleware, deleteReview);

export default router;
