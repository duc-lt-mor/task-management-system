import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import express from 'express';
import { UserPayload } from '../Interfaces/UserInterfaces';
import dotenv from 'dotenv';
import { roles } from '../Models/Roles';
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

export const accessControl = function (
  userRole: string,
  permission: string,
): boolean {
  const userPermission = roles[userRole] || [];
  return userPermission.includes(permission);
};

