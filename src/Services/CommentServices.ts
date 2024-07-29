import createHttpError from 'http-errors';
import { Comment } from '../Models/comment';
import { Task } from '../Models/task';

export const generate = async function(data: any) {
  return await Comment.create(data)
}

export const reply = function (data: any) {
  return Comment.create(data)
}

export const get = async () => {
  return await Comment.findAll();
};

export const generateKey = async function (task_id: number) {
  const task: any = Task.findByPk(task_id);
  if (!task) {
    const error = createHttpError(404, `Task not found`);
    throw error;
  }

  const count = await Comment.count({ where: { task_id: task_id } });
  const newID = count + 1;
  const taskKey = task.key
  const key = `${taskKey}-C${newID.toString().padStart(4, '0')}`
  return key;
};

export const find = function (key: string) {
    return Comment.findOne({where: {key: key}})
};

export const update = function (key: string, data: any) {
    const task: any = Comment.findOne({where: {key: key}})
    if(!task) {
        const error = createHttpError(404, `Task not found`)
        throw error
    }
    task.content = data.content
    return task
}

export const destroy = function(key: string) {
  return Comment.destroy({where: {key: key}})
}