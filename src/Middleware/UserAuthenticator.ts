import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import express from 'express';
import { UserPayload } from '../Interfaces/UserInterfaces'
import dotenv from 'dotenv';
<<<<<<< HEAD

=======
import { roles } from '../Interfaces/Roles';
import createHttpError from 'http-errors';
>>>>>>> 10effc5a8075e1d8ba4262a250228c93045a32d0
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
  const authHeader = req.header(`Authorization`);
  if (authHeader) {
    jwt.verify(
      authHeader.split(' ')[1],
      JWT_SECRET_KEY,
      (err: any, user: any) => {
        if (err) {
          return res.status(403).send('Unauthorization');
        }
        req.user = user as UserPayload;
        next();
      },
    );
  }

  return res.status(403).send('Unauthorization');
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
    return next(err)
  }
};
<<<<<<< HEAD
=======

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
        const error = createHttpError(403, 'Token is forbidded')
        throw error
      }

      // Attach user to request object
      req.user = user as UserPayload;

      // Check access control
      const userRole: number = req.user.system_role_id;
      const userPermissions = roles[userRole] || [];

      if (!userPermissions.includes(requiredPermission)) {
        const error = createHttpError(403, 'Access denied')
        throw error
      }

      // Proceed to the next middleware or route handler
      return next();
    });
  };
};
>>>>>>> 10effc5a8075e1d8ba4262a250228c93045a32d0
