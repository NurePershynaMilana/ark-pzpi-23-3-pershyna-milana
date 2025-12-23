import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { ApiResponse } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Middleware to check if user is authenticated
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid authorization header found');
      const response: ApiResponse<null> = {
        success: false,
        error: 'Access token is required'
      };
      return res.status(401).json(response);
    }
    
    const token = authHeader.substring(7);
    
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
 
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password_hash'] }
    });
    
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'User not found'
      };
      return res.status(401).json(response);
    }
    
    req.user = user;
    console.log('Auth successful, user added to request');
    next();
    
  } catch (error) {
    console.error('Full error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Invalid or expired token'
    };
    return res.status(401).json(response);
  }
};

// Middleware to check if user is admin
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Authentication required'
      };
      return res.status(401).json(response);
    }
    
    if (req.user.role !== 'admin') {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Admin access required'
      };
      return res.status(403).json(response);
    }
    
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Access denied'
    };
    return res.status(403).json(response);
  }
};

// Middleware to check if user owns the resource or is admin
export const requireOwnershipOrAdmin = (resourceKey: string = 'user_id') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Authentication required'
        };
        return res.status(401).json(response);
      }
      
      if (req.user.role === 'admin') {
        return next();
      }
      
      const resourceUserId = req.params.userId || req.body[resourceKey];
      
      if (!resourceUserId || parseInt(resourceUserId) !== req.user.user_id) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Access denied: you can only access your own resources'
        };
        return res.status(403).json(response);
      }
      
      next();
    } catch (error) {
      console.error('Ownership middleware error:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Access denied'
      };
      return res.status(403).json(response);
    }
  };
};