import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/api-error';

export class UserService {
  async getUserProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound('User profile not found.');
    }
    return user;
  }

  async updateProfile(userId: string, updateData: any) {
    const allowedFields = ['name', 'bio', 'avatarUrl', 'location', 'preferredSizes', 'preferredCategories'];
    const filteredUpdate: any = {};

    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        filteredUpdate[key] = updateData[key];
      }
    }

    const updatedUser = await userRepository.update(userId, filteredUpdate);
    if (!updatedUser) {
      throw ApiError.notFound('User not found for update.');
    }
    return updatedUser;
  }
}

export const userService = new UserService();
