import { System_role } from '../Models/system_role';
import { Role } from '../Models/role';
import { User } from '../Models/user';
import { Project } from '../Models/project';
import { Task } from '../Models/task';
import { Comment } from '../Models/comment';
import { Login } from '../Models/login';
import { Member } from '../Models/member';
import { Colum } from '../Models/colum';
const { Op } = require('sequelize');

export const getProjectById = async (id: number) => {
  let project = await Project.findOne({
    where: {
      id: id,
    },
  });
  return project;
};

export const createProject = async (
  name: String,
  key: String,
  decripstion: String,
  creator_id: number,
  expected_end_date: Date,
) => {
  try {
    let project: any = await Project.create({
      name: name,
      key: key,
      decripstion: decripstion,
      creator_id: creator_id,
      expected_end_date: expected_end_date,
    });
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

export const validateProject = async (
  name: String,
  key: String,
  expected_end_date: Date,
) => {
  let err: Array<string> = [];
  let current_date: Date = new Date();
  if (!name) {
    err.push('Please enter project name');
  }
  if (!key) {
    err.push('Please enter project_key');
  }
  if (expected_end_date < current_date || isNaN(expected_end_date.getTime())) {
    err.push(`expected end date must later than ${current_date}`);
  }
  let project_found = await Project.findOne({
    where: {
      [Op.or]: [{ name: name }, { key: key }],
    },
  });
  if (project_found != null) {
    err.push('project name or project key already been used');
  }
  return err;
};

export const editProject = async (
  name: String,
  decripstion: String,
  expected_end_date: Date,
  id: number,
) => {
  let project: any = await getProjectById(id);
  await project.update({
    name: name,
    decripstion: decripstion,
    expected_end_date: expected_end_date,
  });
};

export const deleteProject = async (id: number) => {
  await Project.destroy({
    where: {
      id: id,
    },
  });
  const n = await Member.destroy({
    where: {
      project_id: id,
    },
  });
  const nn = await Colum.destroy({
    where: {
      project_id: id,
    },
  });
};

export const addMember = async (
  project_id: number,
  user_id: number,
  role_id: number,
) => {
  await Member.create({
    user_id: user_id,
    project_id: project_id,
    role_id: role_id,
  });
};

export const removeMember = async (user_id: number, project_id: number) => {
  await Member.destroy({
    where: {
      [Op.or]: [{ user_id: user_id }, { project_id: project_id }],
    },
  });
};

export const editMemRole = async (
  project_id: number,
  user_id: number,
  role_id: number,
) => {
  let member: any = await Member.findOne({
    where: {
      user_id: user_id,
      project_id: project_id,
    },
  });
  await member.update({
    role_id: role_id,
  });
};

export const createColum = async (
  col_type: string,
  name: string,
  index: number,
  project_id: number,
) => {
  await Colum.create({
    col_type: col_type,
    name: name,
    col_index: index,
    project_id: project_id,
  });
};

export const validateColum = async (
  col_type: string,
  name: string,
  project_id: number,
) => {
  let err: Array<string> = [];
  if (!col_type) {
    err.push('please enter colum type');
  }
  if (!name) {
    err.push('please enter colum name');
  }
  let colum: any = await Colum.findOne({
    where: {
      [Op.and]: [{ name: name }, { project_id: project_id }],
    },
  });
  if (colum) {
    err.push('colum name already exit');
  }
  return err;
};

export const editColum = async (
  col_id: number,
  col_type: string,
  name: string,
  index: number,
) => {
  let colum: any = await Colum.findOne({
    where: {
      id: col_id,
    },
  });
  let respons: Array<string> = [];
  if (!name) {
    respons.push('name remain');
  } else if (name === colum.name) {
    respons.push('name remain');
  } else {
    await colum.update({
      name: name,
    });
  }

  if (!col_type) {
    respons.push('colum type remain');
  } else if (col_type === colum.col_type) {
    respons.push('colum type remain');
  } else {
    await colum.update({
      col_type: col_type,
    });
  }

  if (!index) {
    respons.push('index remain');
  } else if (index === colum.index) {
    respons.push('index remain');
  } else {
    await colum.update({
      col_index: index,
    });
  }
  return respons;
};
