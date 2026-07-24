import { ApiError } from '../utils/api-error';

export const validateSwapCreateInput = (body: any): void => {
  const { requestedItemId, offeredItemIds } = body;
  if (!requestedItemId) {
    throw ApiError.badRequest('Target requested item ID is required.');
  }
  if (!offeredItemIds || !Array.isArray(offeredItemIds) || offeredItemIds.length === 0) {
    throw ApiError.badRequest('You must select at least one item from your closet to offer.');
  }
};
