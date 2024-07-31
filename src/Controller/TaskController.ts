import express from 'express';
import * as services from '../Services/TaskServices';
import * as authenticator from '../Middleware/UserAuthenticator';
import createHttpError from 'http-errors';

export const generateTask = async function (
  req: authenticator.CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const project_id = req.body.project_id;
    const creator_id = req.user?.id;
    const colum_id = 1;
    const key = await services.generateKey(project_id); // Ensure this is awaited
    const taskData = {
      project_id,
      key,
      name: req.body.name,
      description: req.body.description, // Use correct field for description
      creator_id, // Set from authenticated user
      assignee_id: req.body.assignee_id,
      priority: req.body.priority,
      expected_end_date: req.body.expected_end_date,
      real_end_date: req.body.real_end_date,
      colum_id,
    };

    const task = await services.create(taskData);
    if (!task) {
      throw createHttpError(400, `Could not create task. Please try again`)
    }
    return res
      .status(201)
      .json({ message: 'Task generated successfully', task });
  } catch (err) {
    next(err);
  }
};

export const getTask = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const taskId = parseInt(req.params.id);
    if (!taskId) {
      throw createHttpError(404, `Task id not found`);
    }
    const task = services.find(taskId);
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
    const tasks = await services.get();
    if (!tasks) {
      throw createHttpError(404, `No tasks found`);
    }
    return res.status(201).json(tasks);
  } catch (err) {
    return next(err);
  }
};

export const update = function (
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
      status: req.body.status,
      assignee_id: req.body.assignee_id,
      creator_id: req.body.creator_id,
      end_date: req.body.end_date,
      real_end_date: req.body.real_end_date,
    };

    const result: any = services.update(taskId, updateData);

    if (!result) {
      throw createHttpError(400, `Couldn't update task data`);
    }

    return res.status(200).json(result.task);
  } catch (err) {
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
    const deleted = await services.deleteTask(id);
    if (deleted) {
      return res.status(201).json({ message: `Task deleted`, deleted });
    }
  } catch (err) {
    return next(err);
  }
};

export const search = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const searchValue = req.params.search || req.query.search;

    if (!searchValue) {
      throw createHttpError(400, `Search value is required`);
    }
  } catch (err) {
    next(err);
  }
};
