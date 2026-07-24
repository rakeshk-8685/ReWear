import { reviewRepository } from '../repositories/review.repository';
import { swapRepository } from '../repositories/swap.repository';
import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/api-error';

export class ReviewService {
  async createReview(reviewerId: string, swapRequestId: string, rating: number, comment: string) {
    const swap = await swapRepository.findById(swapRequestId);
    if (!swap) {
      throw ApiError.notFound('Swap request not found.');
    }

    if (swap.status !== 'COMPLETED') {
      throw ApiError.badRequest('You can only leave a review for completed clothing swaps.');
    }

    const requesterId = swap.requester._id.toString();
    const receiverId = swap.receiver._id.toString();

    if (reviewerId !== requesterId && reviewerId !== receiverId) {
      throw ApiError.forbidden('You were not a participant in this swap.');
    }

    const revieweeId = reviewerId === requesterId ? receiverId : requesterId;

    const existing = await reviewRepository.findBySwapAndReviewer(swapRequestId, reviewerId);
    if (existing) {
      throw ApiError.conflict('You have already submitted a review for this swap.');
    }

    const review = await reviewRepository.create({
      swapRequest: swapRequestId as any,
      reviewer: reviewerId as any,
      reviewee: revieweeId as any,
      rating,
      comment,
    });

    await userRepository.updateRating(revieweeId, rating);

    return review;
  }

  async getUserReviews(userId: string) {
    return reviewRepository.findByReviewee(userId);
  }
}

export const reviewService = new ReviewService();
