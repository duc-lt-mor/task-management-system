import { Task } from '../Models/task';
import { Op, Sequelize } from 'sequelize';

export const totalTask = async function (filter: any) {
  const tasks = await Task.count(filter);
  return tasks;
};

export const showFinishOnDateTask = async function (filter: any) {
  const onDateTask = await Task.findAll({
    where: {
      ...filter.where,
      expected_end_date: {
        [Op.gt]: Sequelize.col(`real_end_date`),
      },
    },
  });
  const tasks = (await totalTask(filter)) as unknown as number;
  const percentage = (onDateTask.length / tasks) * 100;

  return {
    count: onDateTask.length,
    percentage: Number(percentage.toFixed(2)) + `%`  
  };
};

export const showUnfinishedTask = async function (filter: any) {
  const unfinishedTasks = await Task.findAll({
    where: {
      ...filter.where,
      real_end_date: null,
    },
  });

  const tasks = (await totalTask(filter)) as unknown as number;
  const percentage = (unfinishedTasks.length / tasks) * 100;
  return {
    count: unfinishedTasks.length,
    percentage: Number(percentage.toFixed(2)) + `%`  
  };
};

export const showFinishBehindDateTask = async function (filter: any) {
  const lateTasks: any = await Task.findAll({
    where: {
      ...filter.where,
      real_end_date: {
        [Op.gt]: Sequelize.col(`expected_end_date`),
      },
    },
  });
  const tasks = (await totalTask(filter)) as unknown as number;
  const percentage = (lateTasks.length / tasks) * 100;
  return {
    count: lateTasks.length,
    percentage: Number(percentage.toFixed(2)) + `%`,
  };
};

export const taskStatistics = async function (filter: any) {
  const totalTasks = await totalTask(filter);
  const onDateTasks = await showFinishOnDateTask(filter);
  const unfinishedTasks = await showUnfinishedTask(filter);
  const behindScheduleTasks = await showFinishBehindDateTask(filter);
  return {
    totalTasks,
    onDateTasks,
    unfinishedTasks,
    behindScheduleTasks,
  };
};
