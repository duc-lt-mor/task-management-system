import { Task } from '../Models/task';
import express from 'express';

export const generateTask = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    const name = req.body.name;
    const description = req.body.name;
    const creator_id = req.body.creator_id;
    const assignee_id = req.body.assignee_id;
    const priority = req.body.priority;
    const expected_end_date = req.body.expected_end_date;
    const real_end_date = req.body.real_end_date;
    const colum_id = 1;

    const task = await Task.create({
      name,
      description,
      creator_id,
      assignee_id,
      priority,
      expected_end_date,
      real_end_date,
      colum_id,
    });
    return res
      .status(201)
      .json({ message: `Task generated successfully`, task });
  } catch (err) {
    return res.status(500).send(`Internal error`);
  }
};

export const getTask = async function (req: express.Request, res: express.Response) {
  try {
    const taskId = req.params.id;
    if (!taskId) {
      return res.status(404).send(`Task not found, try another ID`);
    }
    const task = Task.findByPk(taskId);
    return res.status(201).json(task);
  } catch (err) {
    return res.status(500).send(`Internal error`);
  }
};

export const getTasks = async function (req: express.Request, res: express.Response) {
  try {
    const tasks = await Task.findAll();
    return res.status(201).json(tasks);
  } catch (err) {
    return res.status(500).json(err);
  }
};

//find task by id and update task info
export const updateTaskInfo = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    const creator_id = req.body.creator_id;
    const assignee_id = req.body.assignee_id;
    const end_date = req.body.end_date;

    const taskId = req.params.id;
    if (!taskId) {
      return res.status(404).send(`Task not found`);
    }
    const task: any = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    task.assignee_id = assignee_id;
    task.creator_id = creator_id;
    task.end_date = end_date;

    await task.save();
  } catch (err) {
    return res.status(500).send(`Internal error`);
  }
};

//find task by id and update task status
export const updateStatus = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    const status = req.body.status;
    const taskId = req.params.id;
    if (!taskId) {
      return res.status(404).send(`Task not found`);
    }
    const task: any = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    task.status = status;

    await task.save();
  } catch (err) {
    return res.status(500).send(`Internal error`);
  }
};

//find task by id and delete task
export const deleteTask = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    const taskId = req.params.id;
    if (!taskId) {
      return res.status(404).send(`Task not found, try another ID`);
    }
    const deleted = Task.destroy({ where: { taskId } });
    return res.status(201).json({ message: `Task deleted`, deleted });
  } catch {
    return res.status(500).json(`Internal server error`);
  }
};
