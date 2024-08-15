import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import express from 'express';
import { UserPayload } from '../Interfaces/UserInterfaces';
import dotenv from 'dotenv';
import * as Role from '../Constant/Roles';
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
          return res.status(403).send('Unauthorization' + err);
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
    return next(err);
  }
};

export const isServerAdmin = (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (req.user?.system_role_id == Role.ADMIN) {
   
    next();
  } else {
    console.log(req.user?.system_role_id )
    return res.status(403).send('You do not have permission');
  }
};
