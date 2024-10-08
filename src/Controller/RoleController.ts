import express from 'express';
import * as RoleServices from '../Services/RoleServices';
import { CustomRequest } from '../Middleware/UserAuthenticator';

export const create = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    let role: any = await RoleServices.create(req, req.body);
    return res.status(201).json({
      message: 'create role success',
      data: role,
    });
  } catch (err: any) {
    next(err);
  }
};

export const edit = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    let role: any = await RoleServices.edit(
      Number(req.params.role_id),
      req,
      req.body,
    );
    return res.status(200).json({
      message: 'edit role success',
      data: role,
    });
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

export const changeProjectOwner = async function (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    console.log(req.body.project_id)
    let new_owner: any = await RoleServices.changeProjectOwner(req);
    return res
      .status(200)
      .json({ message: 'change owner success', data: new_owner });
  } catch (err) {
    console.log(err)
    next(err);
  }
};

export const showRole = async function name(
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    let roles = await RoleServices.showRole(Number(req.query.project_id));
    return res.status(200).send(roles);
  } catch (err) {
    next(err);
  }
};
