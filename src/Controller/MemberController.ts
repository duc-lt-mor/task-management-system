import * as MemberServices from '../Services/MemberServices';
import express from 'express';

export const add = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    await MemberServices.add(req, req.body);

    return res.status(200).send('add member success');
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

    return res.status(200).send('delete member success');
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
    await MemberServices.editRole(Number(req.params.member_id), req.body);

    res.status(201).send('edit member role success');
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
    let members = await MemberServices.show(Number(req.params.project_id));

    res.status(200).send(members);
  } catch (err) {
    next(err);
  }
};
