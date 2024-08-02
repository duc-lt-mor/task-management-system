import { Member } from '../Models/member';
import { User } from '../Models/user';
import { MemberData } from '../Interfaces/MemberInterface';
import { sequelize } from '../Config/config';
import { validationResult } from 'express-validator';
import express from 'express';
import createHttpError from 'http-errors';
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
    let member: any = await Member.create(
      {
        user_id: user.id,
        project_id: data.project_id,
        project_role_id: data.project_role_id,
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
   let member: any = await Member.update(
      { project_role_id: Number(data.project_role_id) },
      { where: { id: id }, transaction: t },
    );
    await t.commit();
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
    attributes: {
      exclude: ['id'],
    },
    include: [
      {
        model: User,
      },
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
  return member
}