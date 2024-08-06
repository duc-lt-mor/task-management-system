import { Comment } from '../Models/comment';
import { Transaction } from 'sequelize';

export const generate = async function (data: any, transaction: Transaction) {
  return await Comment.create(data, { transaction });
};

export const reply = function (data: any, transaction: Transaction) {
  return Comment.create(data,  { transaction });
};

export const get = function (id: number) {
  return Comment.findAll({
    where: {
      parent_id: null,
      task_id: id 
    }
  });
};

export const getReplies = function(data: any) {
  return Comment.findAll(data)
}

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
