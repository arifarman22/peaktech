import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { adminMiddleware } from '../utils/middleware';

const router = Router();

router.get('/', adminMiddleware, getDashboardStats);

export default router;
