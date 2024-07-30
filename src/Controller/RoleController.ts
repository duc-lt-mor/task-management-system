import express from 'express';
import * as RoleServices from '../Services/RoleServices';

export const create = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    await RoleServices.create(req, req.body);
    return res.status(200).send('create role success');
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const edit = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    await RoleServices.edit(Number(req.params.role_id), req, req.body);
    return res.status(200).send('edit role success');
  } catch (err) {
    next(err);
  }
};

export const destroy = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    await RoleServices.destroy(Number(req.params.role_id), req);
    return res.status(200).send('delete role success');
  } catch (err) {
    next(err);
  }
};
