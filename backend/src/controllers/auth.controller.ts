import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authService } from '../services/auth.service';
import { validateRegisterInput, validateLoginInput } from '../validators/auth.validator';
import { ApiResponse } from '../utils/api-response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      validateRegisterInput(req.body);
      const result = await authService.register(req.body);

      // Set Refresh Token in HTTP-only Cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      ApiResponse.created(res, 'User account registered successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      validateLoginInput(req.body);
      const result = await authService.login(req.body);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      ApiResponse.success(res, 'Logged in successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies?.refreshToken || req.body?.refreshToken;
      const result = await authService.refreshToken(token);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      ApiResponse.success(res, 'Access token refreshed successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        try {
          const token = authHeader.split(' ')[1];
          const decoded: any = jwt.decode(token);
          if (decoded?.userId) {
            await authService.logout(decoded.userId);
          }
        } catch {}
      }
      res.clearCookie('refreshToken');
      ApiResponse.success(res, 'Logged out successfully');
    } catch (error) {
      res.clearCookie('refreshToken');
      ApiResponse.success(res, 'Logged out successfully');
    }
  }

  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      ApiResponse.success(res, 'Current authenticated user profile retrieved', { user: req.user });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
