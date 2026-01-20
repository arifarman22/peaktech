import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { adminMiddleware } from '../utils/middleware';

const router = Router();

router.get('/', getCategories);
router.post('/', adminMiddleware, createCategory);
router.put('/:id', adminMiddleware, updateCategory);
router.delete('/:id', adminMiddleware, deleteCategory);

export default router;
