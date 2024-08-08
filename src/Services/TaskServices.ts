import { Task } from '../Models/task';
import { Project } from '../Models/project';
import { Transaction } from 'sequelize';
import { sequelize } from '../Config/config';
import { TaskKeyword } from '../Models/task_keyword';

export const create = function (data: any, transaction: Transaction) {
  return Task.create(data, { transaction });
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

export const update = async function (id: number, data: any, user_id: any) {
  try {
    let task: any = await find(id);

    if (task.assignee_id == user_id) {
      await Task.update(
        {
          column_id: data.column_id,
          real_end_date: data.real_end_date,
        },
        {
          where: {
            id: id,
          },
        },
      );
    } else {
      await Task.update(data, {
        where: {
          id: id,
        },
      });
    }
    let updated_task: any = await find(id);
    return updated_task;
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async function (id: number) {
  const t = await sequelize.transaction();
  try {
    await TaskKeyword.destroy({ where: { task_id: id }, transaction: t });
    await Task.destroy({ where: { id }, transaction: t });
    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};
