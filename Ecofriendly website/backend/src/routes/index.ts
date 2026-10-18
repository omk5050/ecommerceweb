import { Router } from 'express';
import healthRoutes from './healthRoutes';
import productRoutes from './productRoutes';
import authRoutes from './authRoutes';

const router = Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);

export default router;
