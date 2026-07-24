import jwt, { Secret } from 'jsonwebtoken';
import { env } from '../config/env';

export interface IJwtPayload {
  userId: string;
  email: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
}

export const generateAccessToken = (payload: IJwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET as Secret, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

export const generateRefreshToken = (payload: IJwtPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET as Secret, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });
};

export const verifyAccessToken = (token: string): IJwtPayload => {
  return jwt.verify(token, env.JWT_SECRET as Secret) as IJwtPayload;
};

export const verifyRefreshToken = (token: string): IJwtPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET as Secret) as IJwtPayload;
};
