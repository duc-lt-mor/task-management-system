import { Member } from '../Models/member';
import { User } from '../Models/user';
import { Project } from '../Models/project';
import { Role } from '../Models/role';
import * as ProjectServices from '../Services/ProjectServices';
import express from 'express';
import { Colum } from '../Models/colum';
import { Task } from '../Models/task';
import  Op   from 'sequelize';

//khoi tao project
export const Create = async function (
  req: express.Request,
  res: express.Response,
) {
    await ProjectServices.Create(req);
    res.status(201).send({ message: 'create success' });
  
};
//sua project
export const Edit = async function (
  req: express.Request,
  res: express.Response,
) {
  let id: number = Number(req.params.projectid);
  let name: string = req.body.name;
  let decripstion: string = req.body.decripstion;
  let expected_end_date: string = req.body.expected_end_date;
  let create_date: Date = new Date(expected_end_date);
  let current_date: Date = new Date();
  let project: any = await ProjectServices.getProjectById(id);

  if (!project) {
    res.status(404).send('project not exit');
  } else if (project.name === name) {
    res.status(400).send('project name has already been used');
  } else if (create_date < current_date || isNaN(create_date.getTime())) {
    res.status(400).send(`expected end date must later than ${current_date}`);
  } else {
    await ProjectServices.Edit(req);
    res.status(201).send({ message: 'update success' });
  }
};
//xoa project
export const Delete = async function (
  req: express.Request,
  res: express.Response,
) {
  let id: number = Number(req.params.projectid);
  let project: any = await getProjectById(id);

  if (!project) {
    //kiem tra xem project co on tai hay khong
    res.status(404).send('project is not exit or already been deleted');
  } else {
    await ProjectServices.Delete(req);
    res.status(201).send({ message: 'delete success' });
  }
};


