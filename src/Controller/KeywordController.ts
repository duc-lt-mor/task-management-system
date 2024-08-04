import express from 'express';
import createHttpError from 'http-errors';
import * as services from '../Services/KeywordServices';

export const search = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const searchValue = req.query.searchValue?.toString();

    if (!searchValue) {
      throw createHttpError(400, `Search value is required`);
    }

    const tasks = await services.search(searchValue);
    if (!tasks) {
      throw createHttpError(
        404,
        `Could not find task with required information`,
      );
    }
    return res.status(200).json(tasks);
  } catch (err) {
    return next(err);
  }
};
