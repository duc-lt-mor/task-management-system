import * as ProjectServices from '../Services/ProjectServices';
import { CustomRequest } from '../Middleware/UserAuthenticator';
import express from 'express';

export const create = async function (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    await ProjectServices.create(req, req.body);
    return res.status(200).send('create project success');
  } catch (err) {
    next(err);
  }
};

export const edit = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    await ProjectServices.edit(Number(req.params.project_id), req, req.body);
    return res.status(200).send('update project success');
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
    await ProjectServices.destroy(Number(req.params.project_id));
    return res.status(200).send('delete project success');
  } catch (err) {
    next(err);
  }
};
