import { Member } from '../Models/member';
import { User } from '../Models/user';
import { Project } from '../Models/project';
import { Role } from '../Models/role';
import * as ProjectServices from '../Services/ProjectServices';
import express from 'express';
import { Colum } from '../Models/colum';
import { Task } from '../Models/task';
import  Op   from 'sequelize';

//them thanh vien
export const add = async function (
    req: express.Request,
    res: express.Response,
  ) {
    let project_id: number = Number(req.params.projectid);
    let find_mem: string = req.body.find_mem;
    let role_id: number = Number(req.body.role_id);
    let user: any = await User.findOne({
      where: {
        [Op.or]: [{ name: find_mem }, { email: find_mem }],
      },
    });
    let project: any = await getProjectById(project_id);
    let member: any = await Member.findOne({
      where: {
        user_id: user.id,
        project_id: project_id,
      },
    });
    if (!project) {
      //kiem tra project co ton tai hay khong
      res.status(404).send('project is not exit or already been deleted');
    } else if (!user) {
      //kiem ta user co ton tai hay khong truoc khi them vao project
      res.status(404).send('user not exit');
    } else if (member) {
      //kiem tra xem user da duoc add vao project hay chua
      res.status(400).send('user already been added');
    } else {
      await addMember(project_id, user.id, role_id);
      res.status(200).send('add member success');
    }
  };
  //xoa member khoi project
  export const remove = async function (
    req: express.Request,
    res: express.Response,
  ) {
    let project_id: number = Number(req.params.projectid);
    let user_id: number = Number(req.body.user_id);
    let member: any = await Member.findOne({
      where: {
        user_id: user_id,
        project_id: project_id,
      },
    });
    if (!member) {
      //kiem tra xem member da bi xoa khoi project hay chua
      res.status(404).send('user already been remove');
    } else {
      await removeMember(user_id, project_id);
      res.status(201).send('remove member success');
    }
  };
  //thay doi role cua member trong project
  export const edit_role = async function (
    req: express.Request,
    res: express.Response,
  ) {
    let project_id: number = Number(req.params.projectid);
    let user_id: number = Number(req.body.user_id);
    let role_id: number = Number(req.body.role_id);
    let member: any = await Member.findOne({
      where: {
        user_id: user_id,
        project_id: project_id,
      },
    });
    if (!member) {
      //kiem tra xem member co trong project hay khong
      res.status(404).send('user already has been remove');
    } else {
      await editMemRole(project_id, user_id, role_id);
      res.status(201).send('edit member role success');
    }
  };
  //xem danh sach thanh vien
  export const show = async function (
    req: express.Request,
    res: express.Response,
  )  {
    let project_id: number = Number(req.params.projectid);
    let members: any = await Member.findAll({
      where: {
        project_id: project_id,
      },
      attributes: {
        exclude: ['id'],
      },
      include: [
        {
          model: User,
        },
      ],
    });
    res.status(200).send(members);
  };