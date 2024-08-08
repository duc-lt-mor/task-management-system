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
      .json({ message: 'create project success', data: project });
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
    let project: any = await ProjectServices.edit(
      Number(req.params.project_id),
      req,
      req.body,
    );
    return res
      .status(200)
      .json({ message: 'update project success', data: project });
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
    return res.status(200).json({message:'delete project success'});
  } catch (err) {
    next(err);
  }
};

export const search = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    let project: any = await ProjectServices.search(req.query);

    if (project) {
      return res.status(200).json({message: 'project found ', data: project });
    } else {
      return res.status(404).json({message: 'project not found '});
    }
  } catch (error) {
    next(error);
  }
};
