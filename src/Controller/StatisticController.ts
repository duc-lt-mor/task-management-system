import * as Statistic from '../Services/StatisticServices';
import express from 'express';

export const showFinishOnDateTask = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    let total_task = await Statistic.totalTask(Number(req.params.id));
    let total_ondate_task = await Statistic.showFinishOnDateTask(
      Number(req.params.id),
    );
    let b: number = (total_ondate_task.length / total_task) * 100;
    res.status(200).json({
      message: 'phan tram so tac hoan thanh dung han ' + b.toFixed(2),
      total_ondate_task,
    });
  } catch (error) {
    next(error);
  }
};

export const showUnfinishedTask = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    let total_task = await Statistic.totalTask(Number(req.params.id));
    const unfinished: any = await Statistic.showUnfinishedTask(
      Number(req.params.id),
    );
    let percent: number = (unfinished.length / total_task) * 100;
    if (unfinished) {
      return res
        .status(200)
        .json({
          'so task chua hoan thanh ': unfinished,
          'phan tram so tac chua hoan thanh': percent.toFixed(2),
        });
    }
  } catch (err) {
    next(err);
  }
};

export const showBehindDateTask = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    let total_task = await Statistic.totalTask(Number(req.params.id));
    const lateTasks: any = await Statistic.showFinishBehindDateTask(
      Number(req.params.id),
    );
    let percent: number = (lateTasks.length / total_task) * 100;
    if (lateTasks) {
      return res
        .status(200)
        .json({
          'so task chua hoan thanh ': lateTasks,
          'phan tram so tac chua hoan thanh': percent.toFixed(2),
        });
    }
  } catch (err) {
    next(err);
  }
};
