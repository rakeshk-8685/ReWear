import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

const app: Application = express();

// Security HTTP Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows cross-origin image loading for Cloudinary & Unsplash
  })
);

// Payload Compression (Gzip / Brotli)
app.use(compression());

// CORS Setup
const allowedOrigins = (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
  if (!origin) return callback(null, true);
  const configured = env.CLIENT_URL ? env.CLIENT_URL.split(',').map((s) => s.trim().replace(/\/$/, '')) : [];
  const normalizedOrigin = origin.replace(/\/$/, '');
  if (configured.includes(normalizedOrigin) || normalizedOrigin.includes('localhost') || normalizedOrigin.endsWith('.onrender.com')) {
    return callback(null, true);
  }
  return callback(null, true);
};

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Global API Rate Limiting (5000 requests per 15 min per IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

// Auth Endpoint High-Volume Rate Limiter for Dev/Testing (5000 attempts per 15 min)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  message: { success: false, message: 'Too many authentication attempts. Please try again later.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Structured Request Logger Middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
});

// Cookie Parser Helper
app.use((req: Request, _res: Response, next: NextFunction) => {
  const cookieHeader = req.headers.cookie;
  req.cookies = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      if (parts.length === 2) {
        req.cookies[parts[0].trim()] = decodeURIComponent(parts[1].trim());
      }
    });
  }
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    service: 'ReWear Enterprise API Gateway',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// API Routes Router Mount
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

export default app;
