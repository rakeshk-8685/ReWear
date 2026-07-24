import { ApiError } from '../utils/api-error';

export const validateItemCreateInput = (body: any): void => {
  const { title, description, category, size, condition, valueEstimate } = body;

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    throw ApiError.badRequest('Item title must be at least 3 characters.');
  }

  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    throw ApiError.badRequest('Description must be at least 10 characters.');
  }

  const validCategories = ['Tops', 'Bottoms', 'Pants', 'Outerwear', 'Dresses', 'Shoes', 'Accessories', 'Vintage'];
  if (!category || !validCategories.includes(category)) {
    throw ApiError.badRequest(`Category must be one of: ${validCategories.join(', ')}`);
  }

  if (!size || typeof size !== 'string') {
    throw ApiError.badRequest('Size is required.');
  }

  const validConditions = ['New with Tags', 'Like New', 'Good', 'Fair'];
  if (!condition || !validConditions.includes(condition)) {
    throw ApiError.badRequest(`Condition must be one of: ${validConditions.join(', ')}`);
  }

  if (valueEstimate !== undefined && (isNaN(Number(valueEstimate)) || Number(valueEstimate) <= 0)) {
    throw ApiError.badRequest('Value estimate must be a positive number.');
  }
};
