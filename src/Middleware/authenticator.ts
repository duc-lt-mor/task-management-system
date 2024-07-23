import jwt, { Secret } from 'jsonwebtoken';
import { UserPayload } from '../Services/userServices';
import express from 'express';
import { User } from '../Models/user';

const JWT_SECRET_KEY: Secret = process.env.JWT_SECRET as Secret;

interface CustomRequest extends express.Request {
  user?: UserPayload;
}

export const authenticateJWT = (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) => {
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

export const verifyToken = async (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send(`No token provided`);
    }
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded as { name: string, email: string, role: string };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token verification failed' });
  }
};

export const authorizeRole = (roles: string[]) => {
  return (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
    if (req.user && roles.includes(req.user.role)) {
      next()
    } else {
      res.status(403).json({ message: 'Forbidden: You are not assigned to this  required role' });
    }
  }
}