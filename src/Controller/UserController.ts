import express from 'express';
import { User } from '../Models/user';
import bcrypt from 'bcrypt';
import { generateToken } from '../Middleware/UserAuthenticator';
import * as services from '../Services/UserServices';

export const getLogin = async function (
  req: express.Request,
  res: express.Response,
) {
  let email = req.body.email;
  let password = req.body.password;
  if (!email) {
    return res.status(400).json(`Please enter your username`);
  }

  if (!password) {
    return res.status(400).json(`Please enter your password`);
  }

  try {
    const user: any = await User.findOne({ where: { email: email } });
    if (!user) {
      res.status(401).json(`Invalid username or password`);
    }

    const compare: boolean = await bcrypt.compare(password, user.password);
    if (!compare) {
      return res.status(401).json('Invalid username or password');
    }
    const token: string = generateToken({
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (err) {
    res.status(500).json(`Internal server error`);
  }
};

export const postRegister = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    await services.register(req, res);
    res.status(201).json({message: `User created`})
  } catch (err) {
    res.status(500).json({message:`Internal server error`});
  }
};


