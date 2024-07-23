import { System_role } from '../Models/system_role';
import { Role } from '../Models/role';
import { User } from '../Models/user';
import { Project } from '../Models/project';
import { Task } from '../Models/task';
import { Comment } from '../Models/comment';
import { Login } from '../Models/login';
import { Member } from '../Models/member';
import { Colum } from '../Models/colum';
import express from 'express';
import  Op   from 'sequelize';

// lay ra 1 project
export const getProjectById = async (id: number) => {
  let project = await Project.findOne({
    where: {
      id: id,
    },
  });
  return project;
};

// tao 1 project
export const Create = async function (req: express.Request) {
  try {
    let project: any = await Project.create({
      name: req.body.name,
      key: req.body.key,
      decripstion: req.body.decripstion,
      creator_id: req.body.creator_id,
      expected_end_date: req.body.expected_end_date,
    });
    // khoi tao 3 cot mac dinh (todo, inprogress, done)
    await Colum.bulkCreate([
      { col_type: 'todo', name: 'TO DO', col_index: 1, project_id: project.id },
      {
        col_type: 'in_progress',
        name: 'IN PROGRESS',
        col_index: 2,
        project_id: project.id,
      },
      { col_type: 'done', name: 'DONE', col_index: 3, project_id: project.id },
    ]);
  } catch (err) {
    throw new Error('Create fail' + err);
  }
};

// sua project
export const Edit = async function (req: express.Request) {
  let project: any = await getProjectById(Number(req.params.project_id));
  await project.update({
    name: req.body.name,
    decripstion: req.body.decripstion,
    expected_end_date: req.body.expected_end_date,
  });
};


