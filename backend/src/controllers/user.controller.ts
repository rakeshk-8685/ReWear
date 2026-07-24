import { Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { ApiResponse } from '../utils/api-response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class UserController {
  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id || req.user?.userId;
      const profile = await userService.getUserProfile(userId!);
      ApiResponse.success(res, 'User profile retrieved successfully', profile);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const updated = await userService.updateProfile(userId, req.body);
      ApiResponse.success(res, 'Profile updated successfully', updated);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
