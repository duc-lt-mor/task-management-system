import { Task } from '../Models/task';
import { Project } from '../Models/project';
import { Op } from 'sequelize';
import { Keyword } from '../Models/keyword';

export const create = function (data: any) {
  return Task.create(data);
};

export const generateKey = async function (project_id: number) {
  const project: any = await Project.findByPk(project_id);
  if (!project) {
    throw new Error(`Project not found`);
  }
  const count = await Task.count({ where: { project_id: project_id } });
  const newID = count + 1;
  const projectPrefix = project.prefix || `PROJ${project_id}`;
  const key = `${projectPrefix}-${newID.toString().padStart(4, '0')}`;
  return key;
};

export const find = function (id: number) {
  return Task.findOne({ where: { id } });
};

export const get = function () {
  return Task.findAll();
};

export const update = function (id: number, data: any) {
  const task: any = find(id);
  if (!task) {
    return { success: false };
  }
  if (data.status !== undefined) {
    task.status = data.status;
  }

  if (data.assignee_id !== undefined) {
    task.assignee_id = data.assignee_id;
  }

  if (data.priority) {
    task.priority = data.priority;
  }

  if (data.real_end_date !== undefined) {
    task.real_end_date = data.real_end_date;
  }
};

export const deleteTask = function (id: number) {
  return Task.destroy({ where: { id } });
};


