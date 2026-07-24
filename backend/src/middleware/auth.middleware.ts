import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, IJwtPayload } from '../utils/jwt.utils';
import { ApiError } from '../utils/api-error';

export interface AuthenticatedRequest extends Request {
  user?: IJwtPayload;
}

export const authenticateJwt = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Access denied. No auth token provided.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return next(ApiError.unauthorized('Invalid or expired authentication token.'));
  }
};

export const optionalAuthenticateJwt = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
    } catch {
      // Ignore token verification failure on public routes
    }
  }
  next();
};
