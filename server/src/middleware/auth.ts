import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import prisma from '../config/prisma.js';
import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  vendorId?: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export const generateToken = (payload: { id: string; role: Role }): string => {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: '7d' });
};

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.headers['x-access-token']) {
      token = req.headers['x-access-token'] as string;
    }

    if (!token) {
      res.status(401).json({ success: false, error: 'Authentication token required' });
      return;
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string; role: Role };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { vendor: true },
    });

    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid token: User not found' });
      return;
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      vendorId: user.vendor?.id,
    };

    next();
  } catch (err: any) {
    res.status(401).json({ success: false, error: 'Authentication failed: ' + (err.message || 'Invalid token') });
  }
};

export const requireRoles = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Access denied. Allowed roles: ${allowedRoles.join(', ')}. Current role: ${req.user.role}`,
      });
      return;
    }

    next();
  };
};
