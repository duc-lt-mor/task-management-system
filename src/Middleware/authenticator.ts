import jwt, { Secret } from 'jsonwebtoken';
import { UserPayload } from '../Services/userServices';
import express from 'express';

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
