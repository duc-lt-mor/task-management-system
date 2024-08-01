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

export const update = async function (id: number, data: any) {
  const task: any = await find(id);
  if (!task) {
    return { success: false };
  }

 try {
 let tas: any =  await Task.update({
    assignee_id: data.assignee_id,
    priority: data.priority,
    real_end_date: data.real_end_date
  },{
    where: {
      id: id
    }
  })
  return tas
 } catch (error) {
  console.log(error)
  throw error
 }
};

export const deleteTask = function (id: number) {
  return Task.destroy({ where: { id } });
};


