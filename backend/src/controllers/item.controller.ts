import { Request, Response, NextFunction } from 'express';
import { itemService } from '../services/item.service';
import { validateItemCreateInput } from '../validators/item.validator';
import { ApiResponse } from '../utils/api-response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class ItemController {
  async createItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      validateItemCreateInput(req.body);
      const files = req.files as Express.Multer.File[];
      let imageUrls: string[] = files && files.length > 0 ? files.map((f: any) => f.path || f.secure_url) : [];

      if (imageUrls.length === 0 && req.body.images) {
        if (Array.isArray(req.body.images)) {
          imageUrls = req.body.images;
        } else if (typeof req.body.images === 'string') {
          try {
            imageUrls = JSON.parse(req.body.images);
          } catch {
            imageUrls = [req.body.images];
          }
        }
      }

      if (req.body.tags && typeof req.body.tags === 'string') {
        try {
          req.body.tags = JSON.parse(req.body.tags);
        } catch {
          req.body.tags = req.body.tags.split(',').map((t: string) => t.trim());
        }
      }

      const newItem = await itemService.createItem(req.user!.userId, req.body, imageUrls);
      ApiResponse.created(res, 'Item listed successfully for swap', newItem);
    } catch (error) {
      next(error);
    }
  }

  async getItemById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await itemService.getItemById(req.params.id);
      ApiResponse.success(res, 'Item details fetched', item);
    } catch (error) {
      next(error);
    }
  }

  async getFilteredItems(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        search,
        category,
        condition,
        gender,
        size,
        brand,
        minValue,
        maxValue,
        status,
        location,
        ownerId,
        excludeOwnerId,
        page,
        limit,
      } = req.query;

      const filterOptions = {
        search: search as string,
        category: category as string,
        condition: condition as string,
        gender: gender as string,
        size: size as string,
        brand: brand as string,
        minValue: minValue ? Number(minValue) : undefined,
        maxValue: maxValue ? Number(maxValue) : undefined,
        status: status as string,
        location: location as string,
        ownerId: ownerId as string,
        excludeOwnerId: excludeOwnerId as string,
      };

      const pageNum = page ? parseInt(page as string, 10) : 1;
      const limitNum = limit ? parseInt(limit as string, 10) : 12;

      const result = await itemService.getFilteredItems(filterOptions, pageNum, limitNum);
      ApiResponse.success(res, 'Filtered items fetched', result.items, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await itemService.updateItem(req.params.id, req.user!.userId, req.body);
      ApiResponse.success(res, 'Item updated successfully', updated);
    } catch (error) {
      next(error);
    }
  }

  async deleteItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await itemService.deleteItem(req.params.id, req.user!.userId, req.user!.role);
      ApiResponse.success(res, 'Item deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async toggleLike(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { item, liked } = await itemService.toggleLike(req.params.id, req.user!.userId);
      ApiResponse.success(res, liked ? 'Added to favorites' : 'Removed from favorites', { item, liked });
    } catch (error) {
      next(error);
    }
  }
}

export const itemController = new ItemController();
