import { ApiError } from '../utils/api-error';

export const validateReviewInput = (body: any): void => {
  const { swapRequestId, rating, comment } = body;
  if (!swapRequestId) {
    throw ApiError.badRequest('Swap Request ID is required.');
  }
  if (!rating || isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
    throw ApiError.badRequest('Rating must be an integer between 1 and 5.');
  }
  if (!comment || typeof comment !== 'string' || comment.trim().length < 5) {
    throw ApiError.badRequest('Comment must be at least 5 characters long.');
  }
};
