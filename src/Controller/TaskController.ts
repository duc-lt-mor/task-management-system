import express from 'express';
import * as services from '../Services/TaskServices';
import * as authenticator from '../Middleware/UserAuthenticator';
import createHttpError from 'http-errors';
import { Colum } from '../Models/colum';
import { TaskKeyword } from '../Models/task_keyword';
import { sequelize } from '../Config/config';
import * as keywords from '../Services/KeywordServices';

export const generateTask = async function (
  req: authenticator.CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const transaction = await sequelize.transaction();

    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const project_id: number = Number(req.body.project_id);
    const creator_id: number = req.user?.id;
    let colum: any = await Colum.findOne({
      where: {
        project_id: project_id,
        col_index: 1,
      },
    });
    const colum_id: number = colum.id;
    const key = await services.generateKey(project_id); // Ensure this is awaited
    const taskData = {
      project_id,
      key,
      name: req.body.name,
      description: req.body.description,
      creator_id,
      assignee_id: req.body.assignee_id,
      priority: req.body.priority,
      start_date: req.body.start_date,
      expected_end_date: req.body.expected_end_date,
      colum_id,
    };

    const task: any = await services.create(taskData, transaction);
    if (!task) {
      throw createHttpError(400, `Could not create task. Please try again`);
    }
    const taskName = [task.name];
    const records = await keywords.addKeyword(taskName, transaction, task.id);
    console.log(records);
    for (const { id: keyword_id } of records) {
      await TaskKeyword.create(
        {
          task_id: task.id,
          keyword_id,
        },
        { transaction },
      );
    }

    await transaction.commit();

    return res
      .status(201)
      .json({ message: 'Task generated successfully', task });
  } catch (err) {
    return next(err);
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
      throw createHttpError(404, `No tasks found`);
    } else {
      return res.status(200).json(tasks);
    }
  } catch (err) {
    return next(err);
  }
};

export const updateAsAssignee = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const taskId = parseInt(req.params.id);

    if (isNaN(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const updateData = {
      colum_id: req.body.colum_id,
      real_end_date: req.body.real_end_date,
    };

    let result: any = await services.updateAsAssignee(taskId, updateData);
    if (!result) {
      throw createHttpError(400, `Couldn't update task data`);
    }

    return res.status(200).json('update task success');
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const update = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const taskId = parseInt(req.params.id);

    if (isNaN(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const updateData = {
      colum_id: req.body.colum_id,
      real_end_date: req.body.real_end_date,
      priority: req.body.priority,
      assignee_id: req.body.assignee_id,
      start_date: req.body.start_date,
    };
    let result: any = await services.update(taskId, updateData);
    if (!result) {
      throw createHttpError(400, `Couldn't update task data`);
    }

    return res.status(200).json({ 'update task success': result });
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
