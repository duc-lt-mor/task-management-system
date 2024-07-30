import createHttpError from 'http-errors';
import { Comment } from '../Models/comment';

export const generate = async function(data: any) {
  return await Comment.create(data)
}

export const reply = function (data: any) {
  return Comment.create(data)
}

export const get = async () => {
  return await Comment.findAll();
};

export const find = function (id: number) {
    return Comment.findOne({where: {id: id}})
};

export const update = function (id: number, data: any) {
    const task: any = Comment.findOne({where: {id: id}})
    if(!task) {
        const error = createHttpError(404, `Task not found`)
        throw error
    }
    task.content = data.content
    return task
}

export const destroy = function(id: number) {
  return Comment.destroy({where: {id: id}})
}