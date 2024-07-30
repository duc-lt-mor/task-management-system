import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import express from 'express';
import { UserPayload } from '../Interfaces/UserInterfaces'
import dotenv from 'dotenv';
import { roles } from '../Interfaces/Roles';
dotenv.config();

const JWT_SECRET_KEY: Secret = process.env.JWT_SECRET as Secret;

export interface CustomRequest extends express.Request {
  user?: UserPayload;
}

export const authenticateJWT = function (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET_KEY);
    req.user = decoded as UserPayload
    return next()
  }

  return res.status(403).json('Unauthorization');
};

export const verifyToken = async function (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).send(`No token provided`);
    }
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded as UserPayload;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token verification failed' });
  }
};

export const accessControl = (requiredPermission: string) => {
  return (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
    // Extract token from headers
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Verify JWT
    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
      }

      // Attach user to request object
      req.user = user as UserPayload;

      // Check access control
      const userRole: number = req.user.system_role_id;
      const userPermissions = roles[userRole] || [];

      if (!userPermissions.includes(requiredPermission)) {
        return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
      }

      // Proceed to the next middleware or route handler
      next();
    });
  };
};