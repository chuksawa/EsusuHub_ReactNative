import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      });
      return;
    }

    const token = authHeader.substring(7);
    
    // In dev mode, accept dev tokens (for testing without real auth)
    if (config.nodeEnv === 'development' && token.startsWith('dev_token')) {
      // For dev tokens, try to extract user ID from token or use default
      // Dev tokens from LoginScreen use format: dev_token_<timestamp>
      // The user ID is stored separately, but for now use a consistent dev user ID
      // This allows dev login to work without requiring database user
      const devUserId = 'dev-user-123'; // Consistent dev user ID
      req.userId = devUserId;
      req.user = { 
        id: devUserId, 
        email: 'dev@esusuhub.com' 
      };
      console.log('🔧 Dev mode: Accepted dev token, using dev user ID:', devUserId);
      next();
      return;
    }
    
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as { userId: string; email: string };
      req.userId = decoded.userId;
      req.user = { id: decoded.userId, email: decoded.email };
      next();
    } catch (error) {
      res.status(401).json({ 
        message: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      });
      return;
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Authentication error',
      code: 'AUTH_ERROR'
    });
    return;
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, config.jwt.secret) as { userId: string; email: string };
        req.userId = decoded.userId;
        req.user = { id: decoded.userId, email: decoded.email };
      } catch (error) {
        // Ignore invalid tokens for optional auth
      }
    }
    next();
  } catch (error) {
    next();
  }
};

