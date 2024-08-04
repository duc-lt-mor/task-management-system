import createHttpError from 'http-errors';
import { Comment } from '../Models/comment';

export const generate = async function (data: any) {
  return await Comment.create(data);
};

export const reply = function (data: any) {
  return Comment.create(data);
};

export const get = async () => {
  return await Comment.findAll();
};

export const find = function (id: number) {
  return Comment.findOne({ where: { id: id } });
};

export const update = async function (id: number, content: string) {
  await Comment.update(
    {
      content: content,
    },
    { where: { id: id } },
  );

  let comment = await Comment.findOne({
    where: {
      id: id,
    },
  });
  return comment;
};

export const destroy = function (id: number) {
  return Comment.destroy({ where: { id: id } });
};
