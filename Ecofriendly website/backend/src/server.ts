import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load root .env first
dotenv.config();
// Also load backend/.env if present (convenient for local dev when running from root)
const backendEnv = path.resolve(__dirname, '../.env');
if (fs.existsSync(backendEnv)) {
  dotenv.config({ path: backendEnv });
}

import next from 'next';
import app, { attachNextHandler, attachFallbackHandlers } from './app';
import { connectDB } from './config/database';

const PORT = parseInt(process.env.PORT || '5000', 10);
const isCompiled = __dirname.includes('dist');
const isProduction = process.env.NODE_ENV === 'production' || isCompiled;
const shouldServeFrontend = process.env.SERVE_FRONTEND === 'true' || isProduction;

/**
 * Locate project root where next.config.ts / .next are located.
 * Works regardless of whether invoked from project root or backend directory,
 * in development (src/) or production (dist/).
 */
function findProjectRoot(): string {
  if (
    fs.existsSync(path.resolve(process.cwd(), 'next.config.ts')) ||
    fs.existsSync(path.resolve(process.cwd(), '.next'))
  ) {
    return process.cwd();
  }
  const relativeRoot = path.resolve(__dirname, '../..');
  if (
    fs.existsSync(path.resolve(relativeRoot, 'next.config.ts')) ||
    fs.existsSync(path.resolve(relativeRoot, '.next'))
  ) {
    return relativeRoot;
  }
  return process.cwd();
}

const startServer = async () => {
  try {
    console.log('[Server] Connecting to MongoDB Atlas...');
    await connectDB();

    if (shouldServeFrontend) {
      const projectRoot = findProjectRoot();
      console.log(`[Server] Initializing Next.js production server (dir: ${projectRoot})...`);
      const nextApp = next({
        dev: false,
        dir: projectRoot,
      });
      await nextApp.prepare();
      const nextHandler = nextApp.getRequestHandler();
      attachNextHandler(nextHandler as any);
      console.log('[Server] Next.js production handler mounted successfully.');
    } else {
      attachFallbackHandlers();
      console.log('[Server] Running in standalone API mode. Frontend is handled separately.');
    }

    const server = app.listen(PORT, () => {
      console.log(`[Server] Earthform service running on port ${PORT}`);
      console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
      if (shouldServeFrontend) {
        console.log(`[Server] Serving frontend and API unified on http://localhost:${PORT}`);
      }
    });

    // Graceful Shutdown
    const handleShutdown = (signal: string) => {
      console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log('[Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  } catch (error) {
    console.error('[Server] Initialization failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
};

startServer();

