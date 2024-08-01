import express from 'express';
import createHttpError from 'http-errors';
import * as services from '../Services/KeywordServices';
import { Task } from '../Models/task';
import { sequelize } from '../Config/config';

export const addKeyword = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const transaction = await sequelize.transaction()

    const tasks: any = await Task.findAll();
    const taskNames: string[] = tasks.map((task: { name: any }) => task.name);
    const keywords: any = services.addKeyword(taskNames, transaction);

    return res.status(200).json(keywords);
  } catch (err) {
    next(err);
  }
};

export const search = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const searchValue = req.params.searchValue?.toString();
    console.log(searchValue)

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
