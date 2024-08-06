import * as Statistic from '../Services/StatisticServices';
import express from 'express';

export const showTask = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    let tasks = await Statistic.totalTask(Number(req.params.project_id));

    res.status(200).send(tasks);
  } catch (error) {
    next(error);
  }
};

export const showFinishOnDateTask = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    let onDateTasks = await Statistic.showFinishOnDateTask(
      Number(req.params.project_id),
    );
    let total_task = await Statistic.totalTask(Number(req.params.project_id));
    let total_ondate_task = await Statistic.showFinishOnDateTask(
      Number(req.params.project_id),
    );
    let b: number = (total_ondate_task / total_task) * 100;
    res
      .status(200)
      .json({
        message: 'phan tram so tac hoan thanh dung han ' + b.toFixed(2),
        onDateTasks,
      });
  } catch (error) {
    next(error);
  }
};

export const showUnfinishedTask = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const unfinished = await Statistic.showUnfinishedTask(Number(req.params.id))
    if (unfinished) {
      return res.status(200).json(unfinished)
    }
  } catch (err) {
    next(err)
  }
}

export const showBehindDateTask = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const lateTask = await Statistic.showFinishBehindDateTask(Number(req.params.id))
    if (lateTask) {
      return res.status(200).json(lateTask)
    }
  } catch (err) {
    next(err)
  }
}
