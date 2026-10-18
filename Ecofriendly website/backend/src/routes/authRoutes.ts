import { Router } from 'express';
import { login, logout, getMe } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Public auth endpoints
router.post('/login', login);

// Protected auth endpoints
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);

export default router;
