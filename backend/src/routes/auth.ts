import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { requireAdmin, AuthRequest } from '../middleware/auth';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'aurex_super_secret_jwt_key_change_in_production';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Aurex@2026';

// POST /api/auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.',
      });
    }

    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { username: ADMIN_USERNAME, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          username: ADMIN_USERNAME,
          role: 'admin',
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid username or password.',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error?.message,
    });
  }
});

// GET /api/auth/verify
authRouter.get('/verify', requireAdmin, (req: AuthRequest, res: Response) => {
  return res.json({
    success: true,
    user: req.user,
  });
});
