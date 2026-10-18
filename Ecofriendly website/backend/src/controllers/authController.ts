import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

// ─── Cookie / JWT helpers ──────────────────────────────────────────────────

const COOKIE_NAME = 'auth_token';
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/** Parse "7d" → seconds for cookie maxAge */
function expiresInSeconds(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60; // default 7 days
  const [, n, unit] = match;
  const num = parseInt(n, 10);
  if (unit === 's') return num;
  if (unit === 'm') return num * 60;
  if (unit === 'h') return num * 60 * 60;
  if (unit === 'd') return num * 24 * 60 * 60;
  return 7 * 24 * 60 * 60;
}

function setAuthCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: expiresInSeconds(JWT_EXPIRES_IN) * 1000, // ms
    path: '/',
  });
}

function clearAuthCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}

// ─── Controllers ──────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * Accepts email + password. Returns authenticated admin info without passwordHash.
 * Generic error is returned for any failure to prevent user enumeration.
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!JWT_SECRET) {
      console.error('[Auth] JWT_SECRET is not set. Cannot authenticate.');
      res.status(500).json({ success: false, error: 'Server configuration error.' });
      return;
    }

    const { email, password } = req.body;

    // Input validation
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      res.status(400).json({ success: false, error: 'Email is required.' });
      return;
    }
    if (!password || typeof password !== 'string' || password.length === 0) {
      res.status(400).json({ success: false, error: 'Password is required.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Fetch admin including passwordHash (select: false requires explicit +passwordHash)
    const admin = await Admin.findOne({ email: normalizedEmail }).select('+passwordHash');

    // Generic error — do NOT reveal whether email exists or account is inactive
    const GENERIC_ERROR = 'Invalid email or password.';

    if (!admin || !admin.isActive) {
      res.status(401).json({ success: false, error: GENERIC_ERROR });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordMatch) {
      res.status(401).json({ success: false, error: GENERIC_ERROR });
      return;
    }

    // Sign JWT
    const token = jwt.sign(
      { sub: admin._id.toString(), role: admin.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    setAuthCookie(res, token);

    // Return sanitized admin (toJSON transform strips passwordHash)
    const safeAdmin = admin.toJSON();

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: safeAdmin,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Requires requireAuth middleware. Clears the auth cookie.
 */
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    clearAuthCookie(res);
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Requires requireAuth middleware. Returns the authenticated admin's info.
 */
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // req.admin is set by requireAuth middleware
    const admin = (req as any).admin;
    if (!admin) {
      res.status(401).json({ success: false, error: 'Not authenticated.' });
      return;
    }
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    next(error);
  }
};
