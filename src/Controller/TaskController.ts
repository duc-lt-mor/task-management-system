import express from 'express';
import * as services from '../Services/TaskServices';
import * as authenticator from '../Middleware/UserAuthenticator';
import createHttpError from 'http-errors';
import { Column } from '../Models/column';
import { TaskKeyword } from '../Models/task_keyword';
import { sequelize } from '../Config/config';
import * as keywords from '../Services/KeywordServices';
import { validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import { User } from '../Models/user';
import * as emailService from '../Services/EmailServices'

export const generateTask = async function (
  req: authenticator.CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) {
  const transaction = await sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((e: any) => e.msg);
      const error = createHttpError(
        400,
        JSON.stringify(errorMessages, null, 2),
      );
      throw error;
    }

    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const project_id: number = Number(req.body.project_id);
    const creator_id: number = req.user?.id;

    let column: any = await Column.findOne({
      where: {
        project_id: project_id,
        col_type: 'todo',
      },
    });
    const column_id: number = column.id;
    const key = await services.generateKey(project_id); // Ensure this is awaited
    const taskData = {
      project_id,
      key,
      name: req.body.name,
      description: req.body.description,
      creator_id,
      assignee_id: Number(req.body.assignee_id),
      priority: req.body.priority,
      start_date: req.body.start_date,
      expected_end_date: req.body.expected_end_date,
      column_id,
    };

    const task: any = await services.create(taskData, transaction);
    if (!task) {
      throw createHttpError(400, `Could not create task. Please try again`);
    }
    const taskName = [task.name];
    const records = await keywords.addKeyword(taskName, transaction, task.id);
    for (const { id: keyword_id } of records) {
      await TaskKeyword.create(
        {
          task_id: task.id,
          keyword_id,
        },
        { transaction },
      );
    }

    const assignee: any = await User.findOne({
      where: { id: req.body.assignee_id },
      attributes: ['name', 'email'],
    });

    emailService.initializeEmail('gmail')
    emailService.send(assignee.email, assignee.name, process.env.EMAIL as string, task)
    await transaction.commit();
    return res.status(200).json({data: task})
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

//get 1 task by ID
export const getTask = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const taskId = Number(req.query.id);
    if (!taskId) {
      throw createHttpError(404, `Task id not found`);
    }
    const task: any = await services.find(taskId);
    if (!task) {
      throw createHttpError(404, `No task available with this ID`);
    }
    return res.status(201).json(task);
  } catch (err) {
    return next(err);
  }
};

//get all tasks in a project
export const getTasks = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    let tasks: any = await keywords.search(req.query);
    if (tasks.length == 0) {
      return res.send(`[]`);
    } else {
      return res.status(200).json(tasks);
    }
  } catch (err) {
    return next(err);
  }
};

export const update = async function (
  req: authenticator.CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((e: any) => e.msg);
      const error = createHttpError(
        400,
        JSON.stringify(errorMessages, null, 2),
      );
      throw error;
    }

    const taskId = parseInt(req.params.id);

    if (isNaN(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    let result: any = await services.update(taskId, req.body, req.user?.id);
    if (!result) {
      throw createHttpError(400, `Couldn't update task data`);
    }

    return res
      .status(200)
      .json({ message: 'update task success', data: result });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

//find task by id and delete task
export const deleteTask = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) {
      return res
        .status(404)
        .json({ message: `Task not found, try another ID` });
    }
    await services.deleteTask(id);
    return res.status(201).json({ message: `Task deleted` });
  } catch (err) {
    return next(err);
  }
};
