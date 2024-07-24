import { User } from '../Models/user';
import { Member } from '../Models/member';
import * as ProjectServices from '../Services/ProjectServices';
import { Op } from 'sequelize';
import express from 'express';


export const add_user = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  let project_id: number = Number(req.body.project_id);
  let find_mem: string = req.body.find_mem;
  let err: Array<string> = [];

  let user: any = await User.findOne({
    where: {
      [Op.or]: [{ name: find_mem }, { email: find_mem }],
    },
  });

  let project: any = await ProjectServices.getProjectById(project_id);

  let member: any = await Member.findOne({
    where: {
      user_id: user.id,
      project_id: project_id,
    },
  });

  if (!project) {
    //kiem tra project co ton tai hay khong
    err.push('project is not exit or already been deleted');
  }

  if (!user) {
    //kiem ta user co ton tai hay khong truoc khi them vao project
    err.push('user not exit');
  }

  if (member) {
    //kiem tra xem user da duoc add vao project hay chua
    err.push('user already been added');
  }

  if (err.length > 0) {
    return res.status(400).send(err);
  }

  next();
};


export const move_user = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  let id: number = Number(req.params.id);
  let member: any = await Member.findOne({
    where: {
      id: id,
    },
  });

  if (!member) {
    //kiem tra xem member da bi xoa khoi project hay chua
    return res.status(404).send('user already been remove');
  }

  next();
};
