import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateJwt, (req, res, next) => reviewController.createReview(req, res, next));
router.get('/user/:userId', (req, res, next) => reviewController.getUserReviews(req, res, next));

export default router;
