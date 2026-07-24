import { Request, Response, NextFunction } from 'express';
import { reviewService } from '../services/review.service';
import { validateReviewInput } from '../validators/review.validator';
import { ApiResponse } from '../utils/api-response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class ReviewController {
  async createReview(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      validateReviewInput(req.body);
      const { swapRequestId, rating, comment } = req.body;
      const review = await reviewService.createReview(req.user!.userId, swapRequestId, Number(rating), comment);
      ApiResponse.created(res, 'Swap review submitted', review);
    } catch (error) {
      next(error);
    }
  }

  async getUserReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reviews = await reviewService.getUserReviews(req.params.userId);
      ApiResponse.success(res, 'User reviews fetched', reviews);
    } catch (error) {
      next(error);
    }
  }
}

export const reviewController = new ReviewController();
