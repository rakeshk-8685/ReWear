import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { connectDB } from '../config/db';

export const checkDbConnection = (req: Request, res: Response, next: NextFunction): void => {
  // Allow health check and static docs without DB connection
  if (req.path === '/health' || req.path.startsWith('/api-docs') || req.path.startsWith('/docs')) {
    return next();
  }

  if (mongoose.connection.readyState !== 1) {
    // Fire background reconnect attempt if currently disconnected
    if (mongoose.connection.readyState === 0) {
      connectDB().catch(() => {});
    }

    res.status(503).json({
      success: false,
      message: 'MongoDB database connection is not ready. Please verify MONGO_URI credentials on Render Dashboard and ensure 0.0.0.0/0 IP is allowed in MongoDB Atlas Network Access.',
    });
    return;
  }

  next();
};
