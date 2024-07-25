import express from 'express';
import * as services from '../Services/TaskServices';

export const generateTask = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    const taskData = {
      name: req.body.name,
      description: req.body.name,
      creator_id: req.body.creator_id,
      assignee_id: req.body.assignee_id,
      priority: req.body.priority,
      expected_end_date: req.body.expected_end_date,
      real_end_date: req.body.real_end_date,
      colum_id: 1,
    };

    const task = await services.generate({ taskData });
    return res
      .status(201)
      .json({ message: `Task generated successfully`, task });
  } catch (err) {
    return res.status(500).json(`Internal error`);
  }
};

export const getTask = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    const taskId = parseInt(req.params.id);
    if (!taskId) {
      return res
        .status(404)
        .json({ message: `Task not found, try another ID` });
    }
    const task = services.find(taskId);
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

    const result: any = await services.update(taskId, updateData);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    return res.status(200).json(result.task);
  } catch (err) {
    console.error('Error updating task:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//find task by id and delete task
export const deleteTask = async function (
  req: express.Request,
  res: express.Response,
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
    return res.status(500).json({ message: `Internal server error`, err });
  }
};
