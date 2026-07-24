import { Response, NextFunction } from 'express';
import { chatService } from '../services/chat.service';
import { ApiResponse } from '../utils/api-response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class ChatController {
  async sendMessage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { swapRequestId, message } = req.body;
      const msg = await chatService.sendMessage(req.user!.userId, swapRequestId, message);
      ApiResponse.created(res, 'Message sent', msg);
    } catch (error) {
      next(error);
    }
  }

  async getSwapMessages(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const messages = await chatService.getSwapMessages(req.params.swapId, req.user!.userId);
      ApiResponse.success(res, 'Chat history loaded', messages);
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const count = await chatService.getUnreadCount(req.user!.userId);
      ApiResponse.success(res, 'Unread message count', { unreadCount: count });
    } catch (error) {
      next(error);
    }
  }
}

export const chatController = new ChatController();
