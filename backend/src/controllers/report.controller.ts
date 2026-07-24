import { Request, Response, NextFunction } from 'express';
import { itemRepository } from '../repositories/item.repository';
import { swapRepository } from '../repositories/swap.repository';
import { userRepository } from '../repositories/user.repository';

export class ReportController {
  async getImpactReport(_req: Request, res: Response, next: NextFunction) {
    try {
      const itemsCount = await itemRepository.countAll();
      const swapsCount = await swapRepository.countAll();
      const usersCount = await userRepository.countAll();

      const totalCo2SavedKg = Math.round(swapsCount * 12.5);
      const totalWaterSavedLiters = Math.round(swapsCount * 2700);

      res.status(200).json({
        success: true,
        data: {
          metrics: {
            totalUsers: usersCount,
            totalItems: itemsCount,
            totalSwapsCompleted: swapsCount,
            co2SavedKg: totalCo2SavedKg,
            waterSavedLiters: totalWaterSavedLiters,
          },
          generatedAt: new Date().toISOString(),
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const reportController = new ReportController();
