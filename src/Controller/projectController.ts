import { Member } from '../Models/member';
import { User } from '../Models/user';
import { Project } from '../Models/project';
import { Role } from '../Models/role';
import {
  validateProject,
  createProject,
  getProjectById,
  editProject,
  deleteProject,
  addMember,
  removeMember,
  editMemRole,
  createColum,
  validateColum,
  editColum,
} from '../Services/services';
import express from 'express';
import { Colum } from '../Models/colum';
const { Op } = require('sequelize');
export const create_project = async (
  req: express.Request,
  res: express.Response,
) => {
  let name: string = req.body.name;
  let key: string = req.body.key;
  let decripstion: string = req.body.decripstion;
  let creator_id: number = req.body.creator_id;
  let expected_end_date: string = req.body.expected_end_date;
  let create_date: Date = new Date(expected_end_date);
  let trim_name: string = name.trim();
  let trim_key: string = key.trim();
  let err = await validateProject(trim_name, trim_key, create_date);
  if (err.length > 0) {
    res.status(400).send({ message: err });
  } else {
    await createProject(
      trim_name,
      trim_key,
      decripstion,
      creator_id,
      create_date,
    );
    res.status(201).send({ message: 'create success' });
  }
};

export const edit_project = async (
  req: express.Request,
  res: express.Response,
) => {
  let id: number = Number(req.params.projectid);
  let name: string = req.body.name;
  let decripstion: string = req.body.decripstion;
  let expected_end_date: string = req.body.expected_end_date;
  let create_date: Date = new Date(expected_end_date);
  let current_date: Date = new Date();
  let project: any = await getProjectById(id);
  if (!project) {
    res.status(404).send('project not exit');
  } else if (project.name === name) {
    res.status(400).send('project name has already been used');
  } else if (create_date < current_date || isNaN(create_date.getTime())) {
    res.status(400).send(`expected end date must later than ${current_date}`);
  } else {
    await editProject(name, decripstion, create_date, id);
    res.status(201).send({ message: 'update success' });
  }
};

export const delete_project = async (
  req: express.Request,
  res: express.Response,
) => {
  let id: number = Number(req.params.projectid);
  let project: any = await getProjectById(id);
  if (!project) {
    res.status(404).send('project is not exit or already been deleted');
  } else {
    await deleteProject(id);
    res.status(201).send({ message: 'delete success' });
  }
};

export const add_member = async (
  req: express.Request,
  res: express.Response,
) => {
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
    res.status(404).send('project is not exit or already been deleted');
  } else if (!user) {
    res.status(404).send('user not exit');
  } else if (!member) {
    await addMember(project_id, user.id, role_id);
    res.status(200).send('add member success');
  } else {
    res.status(400).send('user already been added');
  }
};

export const remove_member = async (
  req: express.Request,
  res: express.Response,
) => {
  let project_id: number = Number(req.params.projectid);
  let user_id: number = Number(req.body.user_id);
  let member: any = await Member.findOne({
    where: {
      user_id: user_id,
      project_id: project_id,
    },
  });
  if (!member) {
    res.status(404).send('user already been remove');
  } else {
    await removeMember(user_id, project_id);
    res.status(201).send('remove member success');
  }
};

export const edit_member_role = async (
  req: express.Request,
  res: express.Response,
) => {
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
    res.status(404).send('user already has been remove');
  } else {
    await editMemRole(project_id, user_id, role_id);
    res.status(201).send('edit member role success');
  }
};

export const show_member = async (
  req: express.Request,
  res: express.Response,
) => {
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

export const create_colum = async (
  req: express.Request,
  res: express.Response,
) => {
  let project_id: number = Number(req.params.projectid);
  let col_type: string = req.body.col_type;
  let name: string = req.body.col_name;
  let index: number = Number(req.body.col_index);

  let last_index: number = await Colum.count({
    where: {
      project_id: project_id,
    },
  });
  let err = await validateColum(col_type, name, project_id);
  if (err.length > 0) {
    res.status(400).send({ message: err });
  } else {
    if (isNaN(index)) {
      index = last_index + 1;
    } else {
      for (let i: number = last_index; i >= index; i--) {
        let col1: any = await Colum.findOne({
          where: {
            [Op.and]: [{ col_index: i }, { project_id: project_id }],
          },
        });
        await col1.update({
          col_index: i + 1,
        });
      }
    }
    await createColum(col_type, name, index, project_id);
    res.status(201).send({ message: 'create success' });
  }
};

export const edit_colum = async (
  req: express.Request,
  res: express.Response,
) => {
  let project_id: number = Number(req.params.projectid);
  let col_type: string = req.body.col_type;
  let name: string = req.body.col_name;
  let index: number = Number(req.body.col_index);
  let col_id: number = Number(req.body.col_id);

  let respons: Array<string> = await editColum(
    col_type,
    name,
    index,
    col_id,
    project_id,
  );
  res.status(201).send(respons);
};
