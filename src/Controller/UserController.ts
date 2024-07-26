import express from 'express';
import * as services from '../Services/UserServices';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';


export const getLogin = async function (
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

export const postRegister = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(!errors.isEmpty())
    }

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
