import { User, IUser } from '../models/User';

export class UserRepository {
  async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() });
  }

  async countAll(): Promise<number> {
    return User.countDocuments();
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await User.findByIdAndUpdate(id, { refreshToken: refreshToken ?? undefined });
  }

  async findAll(query: any = {}, skip: number = 0, limit: number = 20): Promise<{ users: IUser[]; total: number }> {
    const total = await User.countDocuments(query);
    const users = await User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    return { users, total };
  }

  async updateRating(userId: string, newRating: number): Promise<void> {
    const user = await User.findById(userId);
    if (!user) return;
    const currentTotal = user.ratingAverage * user.ratingCount;
    user.ratingCount += 1;
    user.ratingAverage = Number(((currentTotal + newRating) / user.ratingCount).toFixed(1));
    await user.save();
  }
}

export const userRepository = new UserRepository();
