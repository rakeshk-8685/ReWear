import { userRepository } from '../repositories/user.repository';
import { itemRepository } from '../repositories/item.repository';
import { User } from '../models/User';
import { Item } from '../models/Item';
import { SwapRequest } from '../models/SwapRequest';
import { ApiError } from '../utils/api-error';

export class AdminService {
  async getDashboardStats() {
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();
    const activeSwaps = await SwapRequest.countDocuments({ status: { $in: ['PENDING', 'ACCEPTED'] } });
    const completedSwaps = await SwapRequest.countDocuments({ status: 'COMPLETED' });
    
    // Sustainability KPI: Avg garment weighs ~0.5kg, saving ~10kg CO2 per swapped item
    const co2SavedKg = completedSwaps * 2 * 10; 

    return {
      totalUsers,
      totalItems,
      activeSwaps,
      completedSwaps,
      co2SavedKg,
    };
  }

  async getAllUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    return userRepository.findAll({}, skip, limit);
  }

  async updateUserRole(targetUserId: string, newRole: 'USER' | 'MODERATOR' | 'ADMIN') {
    const user = await userRepository.findById(targetUserId);
    if (!user) {
      throw ApiError.notFound('User not found.');
    }
    user.role = newRole;
    await user.save();
    return user;
  }

  async updateItemStatusByAdmin(itemId: string, status: 'AVAILABLE' | 'ARCHIVED') {
    const item = await itemRepository.findById(itemId);
    if (!item) {
      throw ApiError.notFound('Item not found.');
    }
    return itemRepository.update(itemId, { status });
  }
}

export const adminService = new AdminService();
