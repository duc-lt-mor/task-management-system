import { where } from 'sequelize';
import { Member } from '../Models/member';
import express from 'express';

//them thanh vien vao project
export const Add = async function (req: express.Request) {
  try {
    await Member.create({
      user_id: req.params.user_id,
      project_id: req.body.project_id,
      role_id: req.body.role_id,
    });
  } catch (err) {
    throw new Error('remove failed ' + err);
  }
};

//xoa thanh vien khoi project
export const Remove = async function (req: express.Request) {
  let id: number = Number(req.params.id);
  try {
    await Member.destroy({
      where: { id: id },
    });
  } catch (err) {
    throw new Error('remove failed ' + err);
  }
};

//cap nhat role cua thanh vien trong project
export const EditRole = async function (req: express.Request) {
  try {
    await Member.update(
      { role_id: Number(req.body.role_id) },
      { where: { id: Number(req.params.id) } },
    );
  } catch (error) {
    throw new Error('update failed ' + error);
  }
};
