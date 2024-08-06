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



export const showFinishOnDateTask = async function (id: number) {
  let onDateTask: any = await Task.findAll({
    where: {
      expected_end_date: {
        [Op.gte]: `real_end_date`
      },
      project_id: id
    },
  });

  return onDateTask;
};

export const showUnfinishedTask = async function (id: number) {
  const unfinishedTasks = await Task.findAll({
    where: {
      real_end_date: null
    }
  })
  if (unfinishedTasks.length === 0) {
    return `Project ${id} has no unfinished tasks.`;
  } else {
    return `Project ${id} has unfinished tasks: ${JSON.stringify(unfinishedTasks, null, 2)}`;
  }
}

export const showFinishBehindDateTask = async function (id: number) {
  const lateTasks: any = await Task.findAll({
    where: {
      real_end_date: {
        [Op.gt]: Sequelize.col(`expected_end_date`)
      },
      project_id: id,
    }
  });
  if (lateTasks.length === 0) {
    return `Project ${id} has no tasks that finished behind schedule.`;
  } else {
    return `Project ${id} has tasks that finished behind schedule: ${JSON.stringify(lateTasks, null, 2)}`;
  }
};

