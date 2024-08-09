import express from 'express';
import * as services from '../Services/UserServices';
import createHttpError from 'http-errors';
import { CustomRequest } from '../Middleware/UserAuthenticator';
import { Member } from '../Models/member';

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
  next: express.NextFunction,
) {
  try {
    const data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      phone_number: req.body.phone_number,
      system_role_id: 2,
    };

    // Check if email is provided and valid
    if (!data.email) {
      return next(createHttpError(400, 'Email is required'));
    }

    // Check if the user already exists
    const existedUser = await services.find(data.email);
    if (existedUser) {
      return next(createHttpError(401, 'User already exists'));
    }

    // Register the new user
    const result: any = await services.register(data);

    // Send response if the user was created successfully
    if (result) {
      return res.status(201).json({ message: 'User created', user: {"id": result.id, "name": result.name, "email": result.email} });
    }

    // Handle unexpected situations
    return next(
      createHttpError(500, 'User registration failed for unknown reasons'),
    );
  } catch (err) {
    // Handle any other errors
    return next(err);
  }
};

export const deleteUser = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const member: any = await Member.findAll({
      where: {
        user_id: id
      }
    })
    if (member.length > 0) {
      return res.status(400).json({message: 'Cannot delete user who is in a project'})
    } else {
      await services.deleteUser(id);
      return res.status(200).json({ message: `Deleted` });
    }
  } catch (err) {
    next(err);
  }
};

export const showProject = async function (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    let projects: any = await services.showProject(Number(req.user?.id));
    return res.status(200).json({ data: projects });
  } catch (err) {
    next(err);
  }
};

export const find = async function (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    let email: any = req.query?.email;
    let user = await services.find(email);
    if (user) {
      return res.status(200).json({ data: user });
    } else {
      return res.status(404).json('user not found');
    }
  } catch (error) {
    next(error);
  }
};
