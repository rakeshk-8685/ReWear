import { itemRepository, IItemFilterOptions } from '../repositories/item.repository';
import { ApiError } from '../utils/api-error';
import mongoose from 'mongoose';

export class ItemService {
  async createItem(ownerId: string, itemData: any, imageUrls: string[]) {
    if (!imageUrls || imageUrls.length === 0) {
      // Provide high quality default unsplash clothing image if no upload provided
      imageUrls = ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800'];
    }

    const newItem = await itemRepository.create({
      ...itemData,
      owner: ownerId as any,
      images: imageUrls,
    });

    return itemRepository.findById(newItem._id.toString());
  }

  async getItemById(itemId: string) {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      throw ApiError.badRequest('Invalid item ID format.');
    }
    const item = await itemRepository.findById(itemId);
    if (!item) {
      throw ApiError.notFound('Clothing item listing not found.');
    }
    await itemRepository.incrementViews(itemId);
    return item;
  }

  async getFilteredItems(options: IItemFilterOptions, page: number = 1, limit: number = 12) {
    const skip = (page - 1) * limit;
    const { items, total } = await itemRepository.findFiltered(options, skip, limit);
    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateItem(itemId: string, ownerId: string, updateData: any) {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      throw ApiError.badRequest('Invalid item ID format.');
    }
    const item = await itemRepository.findById(itemId);
    if (!item) {
      throw ApiError.notFound('Item not found.');
    }

    if (item.owner._id.toString() !== ownerId) {
      throw ApiError.forbidden('You do not have permission to edit this item.');
    }

    return itemRepository.update(itemId, updateData);
  }

  async deleteItem(itemId: string, ownerId: string, userRole: string) {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      throw ApiError.badRequest('Invalid item ID format.');
    }
    const item = await itemRepository.findById(itemId);
    if (!item) {
      throw ApiError.notFound('Item not found.');
    }

    if (item.owner._id.toString() !== ownerId && userRole !== 'ADMIN' && userRole !== 'MODERATOR') {
      throw ApiError.forbidden('Permission denied to delete this item.');
    }

    return itemRepository.delete(itemId);
  }

  async toggleLike(itemId: string, userId: string) {
    if (itemId.startsWith('demo-')) {
      return { item: null, liked: true };
    }
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      throw ApiError.badRequest('Invalid item ID format.');
    }
    return itemRepository.toggleLike(itemId, userId);
  }
}

export const itemService = new ItemService();
