import express from 'express';
import * as services from '../Services/UserServices';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';


export const login = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const token = await services.login(req.body);
    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const register = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      phoneNumber: req.body.phone_number,
      systemRoleID: req.body.system_role_id,
    };

    const existedUser = await services.find(data.email);

    if (existedUser) {
      next(existedUser)
    }

    const result = await services.register(data);

    if (result) {
      res.status(201).json({ message: 'User created', user: result });
    }
  } catch (err) {
    next(err)
  }
};

export const find = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const email = req.body.email
    const user = await services.find(email)
    if (!user) {
      throw createHttpError(404, `User not found`)
    }
    return res.status(200).json({message: `User ${email}: `, user})
  } catch(err) {
    next(err)
  }
} 

export const deleteUser = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const id = parseInt(req.params.id);
    await services.deleteUser(id);
    return res.status(200).json({ message: `Deleted user` });
  } catch (err) {
    next(err)
  }
};
