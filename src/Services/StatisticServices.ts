import { Task } from '../Models/task';
import { Op, Sequelize } from 'sequelize';

export const totalTask = async function (id: number) {
  let tasks: number = await Task.count({
    where: {
      project_id: id,
    },
  });

  return tasks;
};

export const countOnDateTask = async function (id: number) {
  let tasks: number = await Task.count({
    where: Sequelize.literal(
      'real_end_date <= expected_end_date AND project_id = ' + id,
    ),
  });

  return tasks;
};

export const showFinishOnDateTask = async function (id: number) {
  let onDateTask: any = await Task.findAll({
    where: Sequelize.literal(
      'real_end_date <= expected_end_date AND project_id = ' + id,
    ),
  });

  return onDateTask;
};
