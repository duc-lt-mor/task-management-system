import * as ProjectServices from '../Services/ProjectServices';
import { CustomRequest } from '../Middleware/UserAuthenticator';
import express from 'express';

export const create = async function (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    let project: any = await ProjectServices.create(req, req.body);
    return res
      .status(201)
      .json({ message: 'create project success', 'new project': project });
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
    let project: any = await ProjectServices.edit(Number(req.params.project_id), req, req.body);
    return res
      .status(200)
      .json({ message: 'update project success', 'updated project': project });
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
