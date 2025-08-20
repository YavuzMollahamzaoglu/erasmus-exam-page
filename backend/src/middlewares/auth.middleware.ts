import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = authenticateJWT;
export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
      if (err) {
        console.error('JWT verification failed:', err);
        return res.status(403).json({ message: 'Token is not valid' });
      }
      let userId: string | undefined;
      if (typeof user === 'object' && user !== null && 'userId' in user) {
        userId = (user as any).userId;
      }
      if (!userId) {
        console.error('JWT payload missing userId:', user);
        return res.status(403).json({ message: 'Token payload missing userId' });
      }
      req.user = user;
      next();
    });
  } else {
    console.error('Authorization header missing');
    res.status(401).json({ message: 'Authorization header missing' });
  }
}

export function authorizeRoles(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}
