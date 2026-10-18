import { Request, Response } from 'express';
import { getDBStatus } from '../config/database';

export const getHealth = async (req: Request, res: Response): Promise<void> => {
  const dbStatus = getDBStatus();

  res.status(dbStatus.isConnected ? 200 : 503).json({
    success: true,
    message: 'Earthform Backend API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStatus.state,
      connected: dbStatus.isConnected,
      host: dbStatus.host,
      database: dbStatus.database,
    },
    environment: process.env.NODE_ENV || 'development',
  });
};
