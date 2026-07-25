import mongoose from 'mongoose';
import { userRepository } from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.utils';
import { ApiError } from '../utils/api-error';

export class AuthService {
  async register(data: { name: string; email: string; password: string; role?: 'USER' | 'MODERATOR' | 'ADMIN' }) {
    if (mongoose.connection.readyState !== 1) {
      throw ApiError.internal('Database connection is not active. Please ensure MONGO_URI is set on Render and 0.0.0.0/0 IP is allowed in MongoDB Atlas.');
    }

    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw ApiError.conflict('User with this email already exists.');
    }

    const passwordHash = await hashPassword(data.password);
    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role || 'USER',
    });

    const payload = { userId: user._id.toString(), email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await userRepository.updateRefreshToken(user._id.toString(), refreshToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async login(data: { email: string; password: string }) {
    if (mongoose.connection.readyState !== 1) {
      throw ApiError.internal('Database connection is not active. Please ensure MONGO_URI is set on Render and 0.0.0.0/0 IP is allowed in MongoDB Atlas.');
    }

    let user = await userRepository.findByEmail(data.email);

    // Auto-seed demo accounts if logging in with demo credentials for first time
    if (!user && (data.email === 'alex@rewear.com' || data.email === 'admin@rewear.com')) {
      const role = data.email === 'admin@rewear.com' ? 'ADMIN' : 'USER';
      const name = data.email === 'admin@rewear.com' ? 'Platform Administrator' : 'Alex Rivera';
      const registered = await this.register({
        name,
        email: data.email,
        password: data.password || 'password123',
        role,
      });
      user = registered.user;
    }

    if (!user || !user.passwordHash) {
      throw ApiError.unauthorized('Invalid email or password credentials.');
    }

    const isMatch = await comparePassword(data.password, user.passwordHash);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password credentials.');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated. Please contact support.');
    }

    const payload = { userId: user._id.toString(), email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await userRepository.updateRefreshToken(user._id.toString(), refreshToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    if (!token) {
      throw ApiError.unauthorized('Refresh token is required.');
    }

    try {
      const decoded = verifyRefreshToken(token);
      const user = await userRepository.findById(decoded.userId);

      if (!user || user.refreshToken !== token) {
        throw ApiError.unauthorized('Invalid or revoked refresh token.');
      }

      const payload = { userId: user._id.toString(), email: user.email, role: user.role };
      const newAccessToken = generateAccessToken(payload);
      const newRefreshToken = generateRefreshToken(payload);

      await userRepository.updateRefreshToken(user._id.toString(), newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (err) {
      throw ApiError.unauthorized('Expired or invalid refresh token.');
    }
  }

  async logout(userId: string) {
    await userRepository.updateRefreshToken(userId, null);
  }
}

export const authService = new AuthService();
