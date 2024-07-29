import { Project } from '../Models/project';
import { Member } from '../Models/member';
import { Colum } from '../Models/colum';
import { ProjectData } from '../Interfaces/ProjectInterface';
import { sequelize } from '../Config/config';
import { validationResult } from 'express-validator';
import express from 'express';
import createHttpError from 'http-errors';
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
export const create = async function (req: express.Request, data: ProjectData) {
  const t = await sequelize.transaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((e: any) => e.msg);
      const error = createHttpError(400, JSON.stringify(errorMessages,null, 2));
      throw error;
    }
    let project: any = await Project.create(
      {
        name: data.name,
        key: data.key,
        decripstion: data.decriptstion,
        creator_id: data.creator_id,
        expected_end_date: data.expected_end_date,
      },
      { transaction: t },
    );
    // khoi tao 3 cot mac dinh (todo, inprogress, done)
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

    await t.commit();
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
      const error = createHttpError(400, JSON.stringify(errorMessages,null, 2));
      throw error;
    }
    await Project.update(
      {
        name: data.name,
        decripstion: data.decriptstion,
        expected_end_date: data.expected_end_date,
      },
      { where: { id: id }, transaction: t },
    );

    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
};
// xoa project
export const destroy = async (id: number) => {
  const t = await sequelize.transaction();

  try {
    await Promise.all([
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