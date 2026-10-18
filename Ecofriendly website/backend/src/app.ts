import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes';
import { notFoundHandler } from './middleware/notFoundHandler';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// ── CORS ────────────────────────────────────────────────────────────────────
// credentials: true requires specific origins or dynamic validation (cannot use "*")
const allowedOrigins: string[] = [
  process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : '',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, server-to-server, standard same-origin GET)
      if (!origin) {
        callback(null, true);
        return;
      }
      // Check explicitly configured allowed origins
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      // In non-production, allow all for dev convenience
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
        return;
      }
      // In production, allow onrender.com hostnames and same-host origins
      try {
        const originUrl = new URL(origin);
        if (originUrl.hostname.endsWith('.onrender.com') || originUrl.hostname === 'localhost') {
          callback(null, true);
          return;
        }
      } catch {
        // ignore invalid URL format
      }

      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true, // Required for HTTP-only auth cookie
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Cookie Parsing ──────────────────────────────────────────────────────────
app.use(cookieParser());

// ── Body Parsing ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── API Routes ──────────────────────────────────────────────────────────────
app.use('/api', apiRoutes);

// Catch-all for unknown /api/* endpoints (always returns JSON 404, never falls through to Next.js)
app.use('/api', notFoundHandler);

/**
 * Attaches the Next.js production request handler to Express.
 * All non-API requests (HTML pages, static assets, dynamic client routes) are delegated to Next.js.
 */
export function attachNextHandler(nextHandler: (req: Request, res: Response) => Promise<void>): void {
  app.all('*', (req: Request, res: Response) => {
    return nextHandler(req, res);
  });
  app.use(errorHandler);
}

/**
 * Attaches fallback handlers for standalone API mode (local development without Next.js).
 */
export function attachFallbackHandlers(): void {
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      message: 'Welcome to Earthform API (Standalone Mode)',
      healthCheck: '/api/health',
    });
  });
  app.use(notFoundHandler);
  app.use(errorHandler);
}

export default app;

