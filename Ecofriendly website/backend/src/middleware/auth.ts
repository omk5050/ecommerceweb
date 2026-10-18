import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

const COOKIE_NAME = 'auth_token';
const JWT_SECRET = process.env.JWT_SECRET as string;

interface JwtPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * requireAuth — Verifies the HTTP-only auth_token cookie contains a valid JWT.
 * Attaches the sanitized admin document to req.admin.
 * Returns 401 for any authentication failure.
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!JWT_SECRET) {
      res.status(500).json({ success: false, error: 'Server configuration error.' });
      return;
    }

    const token: string | undefined = req.cookies?.[COOKIE_NAME];

    if (!token) {
      res.status(401).json({ success: false, error: 'Authentication required.' });
      return;
    }

    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      res.status(401).json({ success: false, error: 'Invalid or expired session. Please log in again.' });
      return;
    }

    // Fetch admin — passwordHash excluded (select: false)
    const admin = await Admin.findById(payload.sub);

    if (!admin || !admin.isActive) {
      res.status(401).json({ success: false, error: 'Authentication required.' });
      return;
    }

    // Attach sanitized admin to request (toJSON removes passwordHash)
    (req as any).admin = admin.toJSON();

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * requireAdmin — Must be chained AFTER requireAuth.
 * Verifies the authenticated user has the 'admin' role.
 * Returns 403 for insufficient permissions.
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const admin = (req as any).admin;

  if (!admin) {
    res.status(401).json({ success: false, error: 'Authentication required.' });
    return;
  }

  if (admin.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Insufficient permissions.' });
    return;
  }

  next();
};
