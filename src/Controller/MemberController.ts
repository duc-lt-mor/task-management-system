import * as MemberServices from '../Services/MemberServices';
import express from 'express';
import { findRoleById } from '../Services/RoleServices';
import createHttpError from 'http-errors';

export const add = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    let member: any = await MemberServices.add(req, req.body);

    return res
      .status(201)
      .send({ message: 'add member success', data: member });
  } catch (err) {
    next(err);
  }
};

export const remove = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    await MemberServices.remove(Number(req.params.member_id));

    return res.status(200).json({ message: 'delete member success' });
  } catch (err) {
    next(err);
  }
};

export const editRole = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    let role: any = await findRoleById(req.body?.project_role_id);

    if (!role) {
      const error = createHttpError(
        400,
        JSON.stringify('role is not exist', null, 2),
      );
      throw error;
    }

    let member: any = await MemberServices.editRole(
      Number(req.params.member_id),
      req.body,
    );

    return res
      .status(200)
      .send({ message: 'edit member role success', data: member });
  } catch (err) {
    next(err);
  }
};

export const show = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    let members = await MemberServices.show(Number(req.query.project_id));

    res.status(200).send(members);
  } catch (err) {
    next(err);
  }
};

export const findById = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    let members = await MemberServices.findById(Number(req.params.member_id));
    res.status(200).send(members);
  } catch (err) {
    next(err);
  }
};
