import { Member } from '../Models/member';
import express from 'express';

//them thanh vien vao project
export const Add = async function (req: express.Request) {
  await Member.create({
    user_id: req.params.user_id,
    project_id: req.body.project_id,
    role_id: req.body.role_id,
  });
};

//xoa thanh vien khoi project
export const Remove = async function (req: express.Request) {
  await Member.destroy({
    where: {
      user_id: req.body.user_id,
      project_id: req.body.project_id,
    },
  });
};

//cap nhat role cua thanh vien trong project
export const EditRole = async function (req: express.Request) {
  let member: any = await Member.findOne({
    where: {
      user_id: req.body.user_id,
      project_id: req.body.project_id,
    },
  });

  await member.update({
    role_id: req.body.role_id,
  });
};
