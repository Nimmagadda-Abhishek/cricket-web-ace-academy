import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

// Middleware to protect routes (require authentication)
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) Getting token and check if it's there
    let token: string | undefined;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.'
      });
    }

    // 2) Verification token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // 3) Check if user still exists
    const currentUser = await Admin.findById(decoded.id).select('+password');
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token does no longer exist.'
      });
    }

    // 4) Check if user account is active
    if (!currentUser.isActive) {
      return res.status(401).json({
        status: 'fail',
        message: 'Your account has been deactivated. Please contact administrator.'
      });
    }

    // 5) Check if user account is locked
    if (currentUser.isLocked()) {
      return res.status(401).json({
        status: 'fail',
        message: 'Your account is temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }

    // 6) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'fail',
        message: 'User recently changed password! Please log in again.'
      });
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token. Please log in again!'
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        status: 'fail',
        message: 'Your token has expired! Please log in again.'
      });
    } else {
      console.error('Auth middleware error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Something went wrong during authentication'
      });
    }
  }
};

// Middleware to restrict access to certain roles
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in!'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }

    next();
  };
};

// Middleware to check specific permissions
export const checkPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in!'
      });
    }

    if (!req.user.hasPermission(permission)) {
      return res.status(403).json({
        status: 'fail',
        message: `You do not have the required permission: ${permission}`
      });
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (token) {
      const jwtSecret = process.env.JWT_SECRET;
      if (jwtSecret) {
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
        const currentUser = await Admin.findById(decoded.id);
        
        if (currentUser && currentUser.isActive && !currentUser.isLocked()) {
          req.user = currentUser;
        }
      }
    }

    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};

// Middleware to log user activity
export const logActivity = (action: string, resource?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      try {
        const resourceId = req.params.id || req.body.id || req.query.id;
        await req.user.logActivity(action, resource, resourceId, req);
      } catch (error) {
        // Don't fail the request if logging fails
        console.error('Activity logging error:', error);
      }
    }
    next();
  };
};

// Middleware to check if user is super admin
export const requireSuperAdmin = restrictTo('super-admin');

// Middleware to check if user is admin or above
export const requireAdmin = restrictTo('super-admin', 'admin');

// Middleware to check if user is manager or above
export const requireManager = restrictTo('super-admin', 'admin', 'manager');

// Middleware to validate API key for external integrations
export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  const validApiKey = process.env.API_KEY;

  if (!validApiKey) {
    return res.status(500).json({
      status: 'error',
      message: 'API key not configured on server'
    });
  }

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid API key'
    });
  }

  next();
};

// Middleware to check rate limiting based on user role
export const roleBasedRateLimit = (req: Request, res: Response, next: NextFunction) => {
  // This would integrate with express-rate-limit
  // Different limits for different roles
  const limits = {
    'super-admin': 1000, // requests per hour
    'admin': 500,
    'manager': 300,
    'staff': 100,
    'guest': 50
  };

  const userRole = req.user?.role || 'guest';
  const limit = limits[userRole as keyof typeof limits] || 50;

  // Store limit info for rate limiter
  req.rateLimit = { max: limit };
  next();
};

// Generate JWT token
export const signToken = (id: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpire = process.env.JWT_EXPIRE || '7d';

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign({ id }, jwtSecret, {
    expiresIn: jwtExpire,
  });
};

// Create and send token response
export const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN ? 
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000 : 
        7 * 24 * 60 * 60 * 1000) // 7 days default
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// Verify password reset token
export const verifyPasswordResetToken = async (token: string) => {
  try {
    const hashedToken = jwt.sign({ token }, process.env.JWT_SECRET || 'fallback-secret');
    
    const user = await Admin.findOne({
      passwordResetToken: { $exists: true },
      passwordResetExpires: { $gt: Date.now() }
    });

    return user;
  } catch (error) {
    return null;
  }
};

// Middleware to ensure HTTPS in production
export const enforceHTTPS = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production' && req.header('x-forwarded-proto') !== 'https') {
    return res.redirect(`https://${req.header('host')}${req.url}`);
  }
  next();
};

export default {
  protect,
  restrictTo,
  checkPermission,
  optionalAuth,
  logActivity,
  requireSuperAdmin,
  requireAdmin,
  requireManager,
  validateApiKey,
  roleBasedRateLimit,
  signToken,
  createSendToken,
  verifyPasswordResetToken,
  enforceHTTPS
};