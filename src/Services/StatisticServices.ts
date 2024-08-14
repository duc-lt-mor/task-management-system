import { Task } from '../Models/task';
import { Op, Sequelize } from 'sequelize';

export const totalTask = async function (id: number) {
  const tasks: number = await Task.count({
    where: {
      project_id: id,
    },
  });

  return tasks;
};

export const showFinishOnDateTask = async function (id: number) {
  const onDateTask = await Task.findAll({
    where: {
      project_id: id,
      expected_end_date: {
        [Op.gt]: Sequelize.col(`real_end_date`),
      },
    },
  });
  const tasks = (await totalTask(id)) as number;
  const percentage = onDateTask.length / tasks * 100;

  return {
    count: onDateTask.length,
    percentage: Number(percentage.toFixed(2)) + `%`  
  };
};

export const showUnfinishedTask = async function (id: number) {
  const unfinishedTasks = await Task.findAll({
    where: {
      project_id: id,
      real_end_date: null,
    },
  });

  const tasks = (await totalTask(id)) as number;
  const percentage = unfinishedTasks.length / tasks * 100;
  return {
    count: unfinishedTasks.length,
    percentage: Number(percentage.toFixed(2)) + `%`  };
};

export const showFinishBehindDateTask = async function (id: number) {
  const lateTasks: any = await Task.findAll({
    where: {
      project_id: id,
      real_end_date: {
        [Op.gt]: Sequelize.col(`expected_end_date`),
      },
    },
  });
  const tasks = (await totalTask(id)) as number;
  const percentage = lateTasks.length / tasks * 100;
  return {
    count: lateTasks.length,
    percentage: Number(percentage.toFixed(2)) + `%`,
  };
};

export const taskStatistics = async function (projectId: number) {
  const totalTasks = await totalTask(projectId);
  const onDateTasks = await showFinishOnDateTask(projectId);
  const unfinishedTasks = await showUnfinishedTask(projectId);
  const behindScheduleTasks = await showFinishBehindDateTask(projectId);

  return {
    totalTasks,
    onDateTasks,
    unfinishedTasks,
    behindScheduleTasks,
  };
};
