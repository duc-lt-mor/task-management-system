import { Colum } from '../Models/colum';
import { Task } from '../Models/task';
import express from 'express';
import { Op } from 'sequelize';

export const validate_create = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  let err: Array<string> = [];

  if (!req.body.type) {
    err.push('please enter colum type');
  }

  if (!req.body.name) {
    err.push('please enter colum name');
  }

  let colum: any = await Colum.findOne({
    where: {
      name: req.body.name,
      project_id: Number(req.body.project_id),
    },
  });

  if (colum) {
    err.push('colum name already exit');
  }

  if (err.length > 0) {
    return res.status(400).send(err);
  }

  next();
};

export const validate_update = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  let respons: Array<string> = [];

  //lay ra cot can sua
  let colum: any = await Colum.findOne({
    where: {
      id: Number(req.params.col_id),
    },
  });

  //tim trong bang xem co cot nao thuoc cung project co ten bi trung voi ten vua nhap hay khong
  let check_name: any = await Colum.findOne({
    where: {
      name: req.body.name,
      project_id: Number(req.body.project_id),
      id: { [Op.ne]: Number(req.params.col_id) },
    },
  });

  if (check_name) {
    respons.push('colum name already been used');
  }

  if (req.body.name == colum.name) {
    respons.push('colum name remain');
  }

  if (req.body.type == colum.col_type) {
    respons.push('colum type remain');
  }

  if (respons.length > 0) {
    return res.status(400).send(respons);
  }

  next();
};


export const validate_delete = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  let err: Array<string> = [];
  let id: number = Number(req.params.col_id);

  //dem so task hien co trong mot cot
  let tasknum: number = await Task.count({
    where: {
      colum_id: id,
    },
  });

  //lay ra thong tin cot can xoa
  let colum: any = await Colum.findOne({
    where: {
      id: id,
    },
  });

  if (colum.col_type != 'custom') {
    //kiem tra xem cot can xoa co phai cot default khong
    err.push("you can't delete default colum");
  }

  if (tasknum > 0) {
    //kiem tra xem con task nao trong cot khong
    err.push(
      'you have move all tasks of this colum to other colum before you delete it',
    );
  }

  if (err.length > 0) {
    return res.status(400).send(err);
  }

  next();
};
