import express from 'express';
import createHttpError from 'http-errors';
export const exceptionHandler = (
  err: unknown,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const customError = err as createHttpError.HttpError;
  if (customError.statusCode) {
    return res.status(customError.statusCode).json({
      message: customError.message,
    });
  }

  res.status(500).json({
    message: 'Internal Server Error',
  });
};
