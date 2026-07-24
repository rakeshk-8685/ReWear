import { Review, IReview } from '../models/Review';

export class ReviewRepository {
  async create(data: Partial<IReview>): Promise<IReview> {
    const review = new Review(data);
    await review.save();
    return review.populate([
      { path: 'reviewer', select: 'name avatarUrl' },
      { path: 'reviewee', select: 'name avatarUrl' },
    ]);
  }

  async findByReviewee(revieweeId: string): Promise<IReview[]> {
    return Review.find({ reviewee: revieweeId })
      .populate('reviewer', 'name avatarUrl')
      .sort({ createdAt: -1 });
  }

  async findBySwapAndReviewer(swapId: string, reviewerId: string): Promise<IReview | null> {
    return Review.findOne({ swapRequest: swapId, reviewer: reviewerId });
  }
}

export const reviewRepository = new ReviewRepository();
