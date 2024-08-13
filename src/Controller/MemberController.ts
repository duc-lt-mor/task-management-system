import * as MemberServices from '../Services/MemberServices';
import express from 'express';
import { findRoleById } from '../Services/RoleServices';
import createHttpError from 'http-errors';
import { Task } from '../Models/task';
import { Member } from '../Models/member';
import { Project_role } from '../Models/project_role';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import * as EmailServices from '../Services/EmailServices';
import { validationResult } from 'express-validator';
import * as ProjectServices from '../Services/ProjectServices';
import { User } from '../Models/user';
import { Op } from 'sequelize';
EmailServices.initializeEmail('gmail');

export const add = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((e: any) => e.msg);
      const error = createHttpError(400, JSON.stringify(errorMessages));
      throw error;
    }
    let add_mem: string = req.body.add_mem;

    let user: any = await User.findOne({
      where: {
        [Op.or]: [{ name: add_mem }, { email: add_mem }],
      },
    });

    let role: any = await Project_role.findOne({
      where: {
        id: Number(req.body.project_role_id),
      },
    });

    if (!role) {
      const error = createHttpError(400, JSON.stringify('role is not exit'));
      throw error;
    }

    if (role.is_pm) {
      const error = createHttpError(
        400,
        JSON.stringify('you can not chose role pm'),
      );
      throw error;
    }

    let project_id: number = Number(req.body.project_id);

    let project: any = await ProjectServices.findProjectById(project_id);

    if (!project) {
      //kiem tra project co ton tai hay khong
      const error = createHttpError(400, JSON.stringify('project is not exit'));
      throw error;
    }

    if (!user) {
      //kiem ta user co ton tai hay khong truoc khi them vao project
      const error = createHttpError(400, JSON.stringify('user is not exit'));
      throw error;
    }

    let check_member: any = await Member.findOne({
      where: {
        user_id: user.id,
        project_id: project_id,
      },
    });

    if (check_member) {
      //kiem tra xem user da duoc add vao project hay chua
      const error = createHttpError(
        400,
        JSON.stringify('user already been addded'),
      );
      throw error;
    }
    const JWT_SECRET_KEY = process.env.JWT_SECRET as Secret;

    const payload = {
      project_role_id: req.body.project_role_id,
      user_id: user.id,
      project_id: req.body.project_id,
    };

    const options: SignOptions = {
      expiresIn: process.env.expiresIn,
    };

    let token: string = jwt.sign(payload, JWT_SECRET_KEY, options);
    let link: string = `http://localhost:3000/api/members/confirm/${token}`;

    await EmailServices.sendmailMemConfirm(
      req.body.add_mem as string,
      Number(req.body.project_id),
      Number(req.body.project_role_id),
      link,
    );
    return res
      .status(201)
      .send({ message: 'send invitation success', token: token });
  } catch (err) {
    next(err);
  }
};

export const addMemConfirm = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const JWT_SECRET_KEY = process.env.JWT_SECRET as Secret;
    const token = req.params.token;
    console.log(token)
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    let data: any = decoded;
    await MemberServices.add(data);
    return res.status(201).send({ message: 'join success' });
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
      return res
        .status(400)
        .json({ message: 'Project manager cannot be removed from project' });
    } else {
      const tasks: any = await Task.findAll({
        where: {
          project_id: req.body.project_id,
          assignee_id: member?.user_id,
        },
      });
      if (tasks.length > 0) {
        return res
          .status(400)
          .json({ message: 'User must not be working in a task' });
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
