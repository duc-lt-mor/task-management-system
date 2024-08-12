import * as MemberServices from '../Services/MemberServices';
import express from 'express';
import { findRoleById } from '../Services/RoleServices';
import createHttpError from 'http-errors';
import { Task } from '../Models/task';
import { Member } from '../Models/member';
import { Project_role } from '../Models/project_role';

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
    const member: any = await Member.findOne({
      where: {
        id: Number(req.params.member_id),
        project_id: Number(req.body.project_id),
      },
      include: [
        {
          model: Project_role,
        },
      ],
    });
    if (member?.project_role.is_pm) {
      return res.status(400).json({ message: 'Project manager cannot be removed from project' });

    }else {
      const tasks: any = await Task.findAll({
        where: { project_id: req.body.project_id, assignee_id: member?.user_id },
      });
      if (tasks.length > 0) {
        return res.status(400).json({ message: 'User must not be working in a task' });
      } else {
        await MemberServices.remove(Number(req.params.member_id));
        return res.status(200).json({ message: 'delete member success' });
      }
    }
   
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
