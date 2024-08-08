import { Member } from '../Models/member';
import { User } from '../Models/user';
import { MemberData } from '../Interfaces/MemberInterface';
import { sequelize } from '../Config/config';
import { validationResult } from 'express-validator';
import express from 'express';
import createHttpError from 'http-errors';
import * as ProjectServices from '../Services/ProjectServices';
import { Op } from 'sequelize';
import { Project_role } from '../Models/project_role';

//them thanh vien vao project
export const add = async function (req: express.Request, data: MemberData) {
  const t = await sequelize.transaction();
  let add_mem: string = req.body.add_mem;

  let user: any = await User.findOne({
    where: {
      [Op.or]: [{ name: add_mem }, { email: add_mem }],
    },
  });
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((e: any) => e.msg);
      const error = createHttpError(400, JSON.stringify(errorMessages));
      throw error;
    }
    let role: any = await Project_role.findOne({
      where: {
        id: data.project_role_id,
      },
    });
    if (!role) {
      const error = createHttpError(400, JSON.stringify('role is not exit'));
      throw error;
    }

    if (role.is_pm) {
      const error = createHttpError(400, JSON.stringify("you can not chose role pm"));
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
      const error = createHttpError(400, JSON.stringify("user is not exit"));
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
      const error = createHttpError(400, JSON.stringify("user already been addded"));
      throw error;
    }

    let member: any = await Member.create(
      {
        user_id: user.id,
        project_id: Number(data.project_id),
        project_role_id: Number(data.project_role_id),
      },
      { transaction: t },
    );
    await t.commit();
    return member;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

//xoa thanh vien khoi project
export const remove = async function (id: number) {
  const t = await sequelize.transaction();

  try {
    await Member.destroy({
      where: { id: id },
      transaction: t,
    });
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

//cap nhat role cua thanh vien trong project
export const editRole = async function (id: number, data: MemberData) {
  const t = await sequelize.transaction();

  try {
    await Member.update(
      { project_role_id: Number(data.project_role_id) },
      { where: { id: id }, transaction: t },
    );
    await t.commit();
    let member: any = await Member.findOne({
      where: {
        id: id,
      },
    });
    return member;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

//xem danh sach thanh vien cua project
export const show = async function (id: number) {
  let members = await Member.findAll({
    where: {
      project_id: id,
    },
    include: [
      {
        model: User,
      },
      {
        model: Project_role
      }
    ],
  });

  return members;
};

export const findMember = async function (user_id: number, project_id: number) {
  let member: any = await Member.findOne({
    where: {
      user_id: user_id,
      project_id: project_id,
    },
    include: [
      {
        model: Project_role,
      },
    ],
  });
  return member;
};

export const findById = async function (id: number) {
  let member: any = await Member.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Project_role,
      },
    ],
  });
  return member;
};
