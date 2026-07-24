import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import itemRoutes from './item.routes';
import swapRoutes from './swap.routes';
import chatRoutes from './chat.routes';
import reviewRoutes from './review.routes';
import adminRoutes from './admin.routes';
import reportRoutes from './report.routes';
import { seedDatabaseIfEmpty } from '../utils/seed';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/items', itemRoutes);
router.use('/swaps', swapRoutes);
router.use('/chat', chatRoutes);
router.use('/reviews', reviewRoutes);
router.use('/admin', adminRoutes);
router.use('/reports', reportRoutes);

// Demo Seeding Endpoint for Testing Team
router.all('/seed', async (_req, res, next) => {
  try {
    await seedDatabaseIfEmpty(true);
    res.status(200).json({
      success: true,
      message: 'Demo dataset successfully seeded into MongoDB Atlas!',
    });
  } catch (err) {
    next(err);
  }
});

export default router;
