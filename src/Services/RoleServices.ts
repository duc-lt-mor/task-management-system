import { RoleData } from '../Interfaces/RoleInterface';
import { sequelize } from '../Config/config';
import { validationResult } from 'express-validator';
import express from 'express';
import createHttpError from 'http-errors';
import { Project_role } from '../Models/project_role';
import { Member } from '../Models/member';
import { CustomRequest } from '../Middleware/UserAuthenticator';

export const findRoleById = async (id: number) => {
  let project = await Project_role.findOne({
    where: {
      id: id,
    },
  });
  return project;
};

export const create = async function (req: express.Request, data: RoleData) {
  const t = await sequelize.transaction();

  try {
    const errors: any = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((e: any) => e.msg);
      if (errorMessages != 'Invalid value') {
        const error = createHttpError(
          400,
          JSON.stringify(errorMessages, null, 2),
        );
        throw error;
      }
    }

    let role: any = await Project_role.create(
      {
        name: data.name.toLowerCase(),
        is_pm: false,
        project_id: data.project_id,
        permissions: data.permissions,
      },
      { transaction: t },
    );
    await t.commit();
    return role;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

export const edit = async function (
  id: number,
  req: express.Request,
  data: RoleData,
) {
  const t = await sequelize.transaction();
  let role: any = await findRoleById(id);

  if (!data.name) {
    data.name = role.name;
  }

  try {
    const errors: any = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((e: any) => e.msg);
      if (errorMessages != 'Invalid value') {
        const error = createHttpError(
          400,
          JSON.stringify(errorMessages, null, 2),
        );
        throw error;
      }
    }
    await Project_role.update(
      {
        name: data.name.toLowerCase(),
        permissions: data.permissions,
      },
      { where: { id: id }, transaction: t },
    );

    await t.commit();
    let role_updated: any = await Project_role.findOne({
      where: {
        id: id,
      },
    });
    return role_updated;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

export const destroy = async function (id: number, req: express.Request) {
  const t = await sequelize.transaction();

  try {
    const errors: any = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((e: any) => e.msg);
      if (errorMessages != 'Invalid value') {
        const error = createHttpError(
          400,
          JSON.stringify(errorMessages, null, 2),
        );
        throw error;
      }
    }

    await Member.destroy({
      where: {
        project_role_id: id,
      },
      transaction: t,
    });

    await Project_role.destroy({
      where: {
        id: id,
      },
      transaction: t,
    });

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const changeProjectOwner = async function (req: CustomRequest) {
  const t = await sequelize.transaction();
  try {
    const errors: any = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((e: any) => e.msg);
      if (errorMessages != 'Invalid value') {
        const error = createHttpError(
          400,
          JSON.stringify(errorMessages, null, 2),
        );
        throw error;
      }
    }
    let new_owner: any = await Member.findOne({
      where: {
        project_id: req.body.project_id,
        user_id: req.body.new_owner_id,
      },
    });

    await Promise.all([
      //update role new owner to pm
      Project_role.update(
        {
          is_pm: true,
          permissions: [0],
        },
        {
          where: {
            project_id: req.body.project_id,
            id: new_owner.project_role_id,
          },
          transaction: t,
        },
      ),
      //update role old owner to other roles
      Member.update(
        {
          project_role_id: req.body.new_project_role_id,
        },
        {
          where: {
            project_id: req.body.project_id,
            user_id: req.user?.id,
          },
          transaction: t,
        },
      ),
    ]);
    await t.commit();
    return new_owner;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const showRole = async function (id: number) {
  let roles = await Project_role.findAll({
    where: {
      project_id: id,
    },
  });
  return roles;
};
