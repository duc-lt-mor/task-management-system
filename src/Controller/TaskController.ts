import express from 'express';
import * as services from '../Services/TaskServices';
import * as authenticator from '../Middleware/UserAuthenticator'
import createHttpError from 'http-errors';

export const generateTask = async function (req: authenticator.CustomRequest, res: express.Response) {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      const error = createHttpError(401, 'User not authenticated')
      throw error
    }

    const project_id = req.body.project_id;
    const creator_id = req.user?.id
    const colum_id = 1
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
      colum_id
    };

    const task = await services.create(taskData);
    return res.status(201).json({ message: 'Task generated successfully', task });
  } catch (err) {
    console.error(err); // Log error for debugging purposes
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Internal server error', error: err });
    }
  }
};

export const getTask = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    const key = req.params.key;
    if (!key) {
      return res
        .status(404)
        .json({ message: `Task not found, try another ID` });
    }
    const task = services.find(key);
    return res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({ message: `Internal error` });
  }
};

//get all tasks in a project
export const getTasks = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    const tasks = services.get();
    return res.status(201).json(tasks);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const update = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const key = req.params.key;

    if (!key) {
      return res.status(400).json({ message: 'Invalid task key' });
    }

    const updateData = {
      status: req.body.status,
      assignee_id: req.body.assignee_id,
      creator_id: req.body.creator_id,
      end_date: req.body.end_date,
      real_end_date: req.body.real_end_date,
    };

    const result: any = await services.update(key, updateData);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    return res.status(200).json(result.task);
  } catch (err) {
    next(err)
  }
};

//find task by key and delete task
export const deleteTask = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const key = req.params.key;
    if (!key) {
      const error = createHttpError(401, 'Task not found')
    }
    const deleted = await services.deleteTask(key);
    if (deleted) {
      return res.status(201).json({ message: `Task deleted` });
    }
  } catch (err) {
    next(err)
  }
};
