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
        [Op.gte]: Sequelize.col(`real_end_date`)
      },
      project_id: id
    },
  });

  return onDateTask;
};

export const showUnfinishedTask = async function (id: number) {
  const unfinishedTasks = await Task.findAll({
    where: {
      real_end_date: null,
      project_id: id
    }
  })

  return unfinishedTasks; 
  
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
  return lateTasks
};

