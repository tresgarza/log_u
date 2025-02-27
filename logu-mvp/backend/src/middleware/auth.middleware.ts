import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { ApiError } from './error.middleware';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        type: string;
        status: string;
        name?: string;
      };
    }
  }
}

// JWT token secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'logu-secret-key';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // DEV MODE ONLY: Special development access token
    if (process.env.NODE_ENV === 'development') {
      const devToken = req.headers['x-dev-token'];
      if (devToken === 'logu-dev-access-2023') {
        // Mock a test user for development
        req.user = {
          id: 999,
          email: 'dev@logu.test',
          type: req.headers['x-dev-user-type']?.toString() || 'brand',
          status: 'active',
          name: 'Development User'
        };
        
        console.log('⚠️ DEV MODE: Authentication bypassed with dev token');
        return next();
      }
    }
    
    // Regular authentication continues below
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication required. No token provided.');
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new ApiError(401, 'Authentication required. Invalid token format.');
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      type: string;
      status: string;
    };
    
    // Find user
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      throw new ApiError(401, 'User not found or account deactivated');
    }
    
    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      type: decoded.type,
      status: decoded.status,
      name: user.name
    };
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, 'Invalid token'));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, 'Token expired'));
    }
    next(error);
  }
};

/**
 * Role-based authorization middleware
 * @param {string[]} roles - Array of allowed roles
 */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }
    
    if (!roles.includes(req.user.type)) {
      return next(new ApiError(403, 'You do not have permission to access this resource'));
    }
    
    next();
  };
}; 