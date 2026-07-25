import { IJwtPayload } from '../utils/jwt.utils';

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

declare module 'swagger-ui-express';
declare module 'swagger-jsdoc';
