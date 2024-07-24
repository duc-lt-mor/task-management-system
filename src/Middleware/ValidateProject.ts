import { Project } from '../Models/project';
import * as ProjectServices from '../Services/ProjectServices';
import { Op } from 'sequelize';
import express from 'express';


export const validate_create = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  let name: string = req.body.name;
  let key: string = req.body.key;
  let expected_end_date: string = req.body.expected_end_date;
  let create_date: Date = new Date(expected_end_date);
  let trim_name: string = name.trim();
  let trim_key: string = key.trim();
  let err: Array<string> = [];
  let current_date: Date = new Date();

  if (!trim_name) {
    err.push('Please enter project name');
  }

  if (!trim_key) {
    err.push('Please enter project_key');
  }

  if (create_date < current_date || isNaN(create_date.getTime())) {
    err.push(`expected end date must later than ${current_date}`);
  }

  let project_found = await Project.findOne({
    where: {
      [Op.or]: [{ name: name }, { key: key }],
    },
  });

  if (project_found) {
    err.push('project name or project key already been used');
  }

  if(err.length > 0){
    return res.status(400).send(err);
  }
  
  next();
};

//xac thuc du lieu dau vao cho sua project
export const validate_update = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  let id: number = Number(req.params.project_id);
  let name: string = req.body.name;
  let expected_end_date: Date = new Date(req.body.expected_end_date);
  let current_date: Date = new Date();
  let project: any = await ProjectServices.getProjectById(id);
  let err: Array<string> = [];

  if (!name) {
    err.push('Please enter project name');
  }

  if (!project) {
    err.push('project not exit');
  }

  if (project.name === name) {
    err.push('project name has already been used');
  }

  if (expected_end_date < current_date || isNaN(expected_end_date.getTime())) {
    err.push(`expected end date must later than ${current_date}`);
  }

  if(err.length > 0){
    return res.status(400).send(err);
  }
  
  next();
};
