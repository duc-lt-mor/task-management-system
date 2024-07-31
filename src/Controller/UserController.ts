import express from 'express';
import * as services from '../Services/UserServices';
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
  next: express.NextFunction,
) {
  try {
<<<<<<< HEAD
=======
    // Validate the incoming request
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   // If there are validation errors, pass them to the error handler
    //   return next(createHttpError(400, 'Validation errors', { errors: errors.array() }));
    // }

>>>>>>> 10effc5a8075e1d8ba4262a250228c93045a32d0
    const data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      phone_number: req.body.phone_number,
      system_role_id: req.body.system_role_id,
    };

<<<<<<< HEAD
    const existedUser = await services.find(data.email);

    if (existedUser) {
      const error = createHttpError(400, `User existed`);
      throw error;
=======
    // Check if email is provided and valid
    if (!data.email) {
      return next(createHttpError(400, 'Email is required'));
>>>>>>> 10effc5a8075e1d8ba4262a250228c93045a32d0
    }

    // Check if the user already exists
    const existedUser = await services.find(data.email);
    if (existedUser) {
      return next(createHttpError(401, 'User already exists'));
    }

    // Register the new user
    const result = await services.register(data);

    // Send response if the user was created successfully
    if (result) {
      return res.status(201).json({ message: 'User created', user: result });
    }

    // Handle unexpected situations
    return next(createHttpError(500, 'User registration failed for unknown reasons'));
  } catch (err) {
<<<<<<< HEAD
    next(err);
=======
    // Handle any other errors
    return next(err);
>>>>>>> 10effc5a8075e1d8ba4262a250228c93045a32d0
  }
};

export const deleteUser = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    await services.deleteUser(id);
    return res.status(200).json({ message: `Deleted user` });
  } catch (err) {
    next(err);
  }
};
