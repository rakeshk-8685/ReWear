import { Response, NextFunction } from 'express';
import { swapService } from '../services/swap.service';
import { validateSwapCreateInput } from '../validators/swap.validator';
import { ApiResponse } from '../utils/api-response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class SwapController {
  async createSwapProposal(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      validateSwapCreateInput(req.body);
      const { requestedItemId, offeredItemIds, message } = req.body;
      const swap = await swapService.createSwapProposal(
        req.user!.userId,
        requestedItemId,
        offeredItemIds,
        message
      );
      ApiResponse.created(res, 'Swap proposal submitted successfully', swap);
    } catch (error) {
      next(error);
    }
  }

  async getUserSwaps(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const swaps = await swapService.getUserSwaps(req.user!.userId);
      ApiResponse.success(res, 'User swap proposals fetched', swaps);
    } catch (error) {
      next(error);
    }
  }

  async getSwapById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const swap = await swapService.getSwapById(req.params.id, req.user!.userId);
      ApiResponse.success(res, 'Swap request details fetched', swap);
    } catch (error) {
      next(error);
    }
  }

  async updateSwapStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body;
      const swap = await swapService.updateSwapStatus(req.params.id, req.user!.userId, status);
      ApiResponse.success(res, `Swap status updated to ${status}`, swap);
    } catch (error) {
      next(error);
    }
  }

  async updateShippingInfo(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { carrier, trackingNumber } = req.body;
      const swap = await swapService.updateShippingInfo(req.params.id, req.user!.userId, {
        carrier,
        trackingNumber,
      });
      ApiResponse.success(res, 'Shipping tracking info updated', swap);
    } catch (error) {
      next(error);
    }
  }
}

export const swapController = new SwapController();
