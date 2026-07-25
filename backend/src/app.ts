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

// List of explicitly allowed origins for local development & Render deployments
const baseAllowedOrigins = [
  'https://rewear-web.onrender.com',
  'https://rewear-web-4n17.onrender.com',
  'http://localhost:4200',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:80',
  'http://localhost:5000',
  'http://localhost',
  'http://127.0.0.1:4200',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
];

// Helper function to build dynamic origin validator
export const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return true; // Allow non-browser requests (Postman, curl, server-to-server)

  const normalizedOrigin = origin.replace(/\/$/, '');

  // 1. Direct match with hardcoded / default allowed origins
  if (baseAllowedOrigins.includes(normalizedOrigin)) {
    return true;
  }

  // 2. Match configured CLIENT_URL environment variables
  if (env.CLIENT_URL) {
    const configured = env.CLIENT_URL.split(',').map((s) => s.trim().replace(/\/$/, ''));
    for (const url of configured) {
      if (url === normalizedOrigin || `https://${url}` === normalizedOrigin || `http://${url}` === normalizedOrigin) {
        return true;
      }
    }
  }

  // 3. Domain wildcard matching for Render deployments & standard dev environments
  if (
    normalizedOrigin.includes('localhost') ||
    normalizedOrigin.includes('127.0.0.1') ||
    normalizedOrigin.endsWith('.onrender.com') ||
    normalizedOrigin.endsWith('.vercel.app') ||
    normalizedOrigin.endsWith('.netlify.app')
  ) {
    return true;
  }

  return false;
};

const corsOptions: cors.CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    console.warn(`[CORS] Rejected request from unauthorized origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200,
};

// Register CORS middleware at the very top before all routes & rate limiters
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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
