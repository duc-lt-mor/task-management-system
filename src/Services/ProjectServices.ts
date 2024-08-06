import { Project } from '../Models/project';
import { Member } from '../Models/member';
import { Colum } from '../Models/colum';
import { ProjectData } from '../Interfaces/ProjectInterface';
import { sequelize } from '../Config/config';
import { validationResult } from 'express-validator';
import express from 'express';
import createHttpError from 'http-errors';
import { CustomRequest } from '../Middleware/UserAuthenticator';
import { Project_role } from '../Models/project_role';
import { Op } from 'sequelize';
import { Task } from '../Models/task';
// lay ra 1 project
export const findProjectById = async (id: number) => {
  let project = await Project.findOne({
    where: {
      id: id,
    },
  });
  return project;
};

// tao 1 project
export const create = async function (req: CustomRequest, data: ProjectData) {
  const t = await sequelize.transaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((e: any) => e.msg);
      const error = createHttpError(
        400,
        JSON.stringify(errorMessages, null, 2),
      );
      throw error;
    }

    let project: any = await Project.create(
      {
        name: data.name.toLowerCase(),
        key: data.key.toUpperCase(),
        decripstion: data.decriptstion,
        creator_id: req.user?.id,
        expected_end_date: data.expected_end_date,
      },
      { transaction: t },
    );

    // khoi tao 3 cot mac dinh
    await Colum.bulkCreate(
      [
        {
          col_type: 'todo',
          name: 'TO DO',
          col_index: 1,
          project_id: project.id,
        },
        {
          col_type: 'in_progress',
          name: 'IN PROGRESS',
          col_index: 2,
          project_id: project.id,
        },
        {
          col_type: 'done',
          name: 'DONE',
          col_index: 3,
          project_id: project.id,
        },
      ],
      { transaction: t },
    );
    // khoi tao 3 role mac dinh
    let project_role: any = await Project_role.bulkCreate(
      [
        {
          is_pm: true,
          name: 'Project Manager',
          permissions: [0],
          project_id: project.id,
        },
        {
          is_pm: false,
          name: 'Leader',
          permissions: [1, 5, 8, 9, 10, 11, 12, 13, 14, 15],
          project_id: project.id,
        },
        {
          is_pm: false,
          name: 'User',
          permissions: [1, 5, 11],
          project_id: project.id,
        },
      ],
      { transaction: t },
    );

    await Member.create(
      {
        user_id: req.user?.id,
        project_id: project.id,
        project_role_id: project_role[0].id,
      },
      { transaction: t },
    );

    await t.commit();
    return project;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

// sua project
export const edit = async function (
  id: number,
  req: express.Request,
  data: ProjectData,
) {
  const t = await sequelize.transaction();
  let project: any = await findProjectById(id);
  if (!data.name) {
    data.name = project.name;
  }

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((e: any) => e.msg);
      const error = createHttpError(
        400,
        JSON.stringify(errorMessages, null, 2),
      );
      throw error;
    }
    await Project.update(
      {
        name: data.name.toLowerCase(),
        decripstion: data.decriptstion,
        expected_end_date: data.expected_end_date,
      },
      { where: { id: id }, transaction: t },
    );

    await t.commit();
    let project_updated: any = await findProjectById(id);
    return project_updated;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};
// xoa project
export const destroy = async (id: number) => {
  const t = await sequelize.transaction();

  try {
    await Project_role.destroy({
      where: {
        project_id: id,
      },
      transaction: t,
    });
    await Promise.all([
      Task.destroy({
        where: {
          project_id: id,
        },
        transaction: t,
      }),
      Member.destroy({
        where: {
          project_id: id,
        },
        transaction: t,
      }),

      Colum.destroy({
        where: {
          project_id: id,
        },
        transaction: t,
      }),
    ]);

    await Project.destroy({
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

export const search = async function (query: any) {
  let { name, key } = query;
  if (!name && !key) {
    return await Project.findAll();
  }

  const filter: any = {
    where: {},
  };

  if (name) {
    filter.where.name = {
      [Op.like]: `${name}%`,
    };
  }

  if (key) {
    filter.where.key = {
      [Op.like]: `${key}%`,
    };
  }

  let project = await Project.findAll(filter);

  return project;
};
