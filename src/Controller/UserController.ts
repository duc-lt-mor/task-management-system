import express from 'express';
import { User } from '../Models/user';
import bcrypt from 'bcrypt';
import { generateToken } from '../Middleware/UserAuthenticator';
import * as services from '../Services/UserServices';
import { validationResult } from 'express-validator';

export const getLogin = async function (
  req: express.Request,
  res: express.Response,
) {
  const email = req.body.email;
  const password = req.body.password;
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      phoneNumber: req.body.phone_number,
      systemRoleID: req.body.system_role_id,
    };

    const existedUser = await User.findOne({
      where: { email: data.email },
    });

    if (existedUser) {
      return res.status(401).json({ message: `Email is already taken` });
    }

    const result = await services.register(data);

    if (result) {
      res.status(201).json({ message: 'User created', user: result });
    }
  } catch (err) {
    res.status(500).json({ message: `Internal server error`, err });
  }
};

export const deleteUser = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    const name = req.body.name;
    console.log(name);
    const deleted = await services.deleteUser(name);
    if (deleted) return res.status(200).json({ message: `Deleted user` });
  } catch (err) {
    return res.status(500).json(err);
  }
};
