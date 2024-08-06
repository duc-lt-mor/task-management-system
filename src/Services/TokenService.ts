import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { UserPayload } from "../Interfaces/UserInterfaces";

export const generateToken = function (user: UserPayload) {
    const JWT_SECRET_KEY = process.env.JWT_SECRET as Secret;

    const payload: UserPayload = {
      system_role_id: user.system_role_id,
      email: user.email,
      id: user.id,
    };
  
    const options: SignOptions = {
      expiresIn: process.env.expiresIn,
    };
  
    return jwt.sign(payload, JWT_SECRET_KEY, options);
  };
  