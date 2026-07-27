import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';
import { ApiResponse } from '../utils/api-response';

export class AdminController {
  async getDashboardStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await adminService.getDashboardStats();
      ApiResponse.success(res, 'Admin stats fetched', stats);
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const result = await adminService.getAllUsers(page, limit);
      ApiResponse.success(res, 'All platform users fetched', result.users, 200, { total: result.total, page, limit });
    } catch (error) {
      next(error);
    }
  }

  async getAllItems(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const result = await adminService.getAllItems(page, limit);
      ApiResponse.success(res, 'All platform items fetched for admin moderation', result.items, 200, { total: result.total, page, limit });
    } catch (error) {
      next(error);
    }
  }


  async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { role } = req.body;
      const updated = await adminService.updateUserRole(req.params.userId, role);
      ApiResponse.success(res, 'User role updated', updated);
    } catch (error) {
      next(error);
    }
  }

  async updateItemStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body;
      const updated = await adminService.updateItemStatusByAdmin(req.params.itemId, status);
      ApiResponse.success(res, 'Item moderation status updated', updated);
    } catch (error) {
      next(error);
    }
  }

  async getAllSwaps(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const result = await adminService.getAllSwaps(page, limit);
      ApiResponse.success(res, 'All platform swaps fetched', result.swaps, 200, { total: result.total, page, limit });
    } catch (error) {
      next(error);
    }
  }

  async toggleUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await adminService.toggleUserStatus(req.params.userId);
      ApiResponse.success(res, `User status updated to ${updated.isActive ? 'Active' : 'Inactive'}`, updated);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await adminService.deleteUserByAdmin(req.params.userId);
      ApiResponse.success(res, 'User deleted by admin', result);
    } catch (error) {
      next(error);
    }
  }

  async deleteItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await adminService.deleteItemByAdmin(req.params.itemId);
      ApiResponse.success(res, 'Item deleted by admin', result);
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
