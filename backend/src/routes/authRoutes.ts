import { Router } from 'express';
import { register, login, verifyOTP, getMe, updateProfile } from '../controllers/authController';
import { googleAuth } from '../controllers/googleAuthController';
import { authMiddleware } from '../utils/middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/verify-otp', verifyOTP);
router.get('/me', authMiddleware, getMe);
router.put('/profile', authMiddleware, updateProfile);

export default router;
