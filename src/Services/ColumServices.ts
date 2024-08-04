import { Colum } from '../Models/colum';
import { Op } from 'sequelize';
import { ColumData } from '../Interfaces/ColumInterface';
import { sequelize } from '../Config/config';
import { validationResult } from 'express-validator';
import express from 'express';
import createHttpError from 'http-errors';

export const create = async function (data: ColumData, req: express.Request) {
  const t = await sequelize.transaction();

  let cols: number = await Colum.count({
    where: {
      project_id: data.project_id,
    },
  });

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((e: any) => e.msg);
      const error = createHttpError(400, JSON.stringify(errorMessages));
      throw error;
    }
    let colum: any = await Colum.create(
      {
        col_type: data.col_type,
        name: data.name,
        col_index: cols + 1,
        project_id: data.project_id,
      },
      { transaction: t },
    );
    await t.commit();
    return colum;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

export const edit = async function (
  id: number,
  data: ColumData,
  req: express.Request,
) {
  const t = await sequelize.transaction();

  let indexs = data.array_index;
  //lay ra cot can sua
  let colum: any = await Colum.findOne({
    where: {
      id: id,
    },
  });

  if (!data.name) {
    data.name = colum.name;
  }

  if (!data.col_type) {
    data.col_type = colum.col_type;
  }
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((e: any) => e.msg);
      const error = createHttpError(400, JSON.stringify(errorMessages));
      throw error;
    }
    await Promise.all([
      await Promise.all(
        indexs.map(async (inde) =>
          Colum.update(
            { col_index: inde.index },
            { where: { id: inde.id }, transaction: t },
          ),
        ),
      ),

      await Colum.update(
        {
          name: data.name,
          col_type: data.col_type,
        },
        { where: { id: id }, transaction: t },
      ),
    ]);

    await t.commit();
    let colum_updated: any = await Colum.findOne({
      where: {
        id: id,
      },
    });
    return colum_updated;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

export const destroy = async function (id: number, req: express.Request) {
  const t = await sequelize.transaction();

  let colum: any = await Colum.findOne({
    where: {
      id: id,
    },
  });

  //dem so luong task trong 1 project
  let last_index: number = await Colum.count({
    where: {
      project_id: colum.project_id,
    },
  });
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((e: any) => e.msg);
      const error = createHttpError(400, JSON.stringify(errorMessages));
      throw error;
    }
    //giam gia tri index cua cac cot o cuoi den vi tri cua cot can xoa
    for (let i: number = last_index; i >= colum.col_index; i--) {
      let col: any = await Colum.findOne({
        where: {
          [Op.and]: [{ col_index: i }, { project_id: colum.project_id }],
        },
      });

      await col.update(
        {
          col_index: i - 1,
        },
        { transaction: t },
      );
    }

    await Colum.destroy({
      where: {
        id: id,
      },
      transaction: t,
    });
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
};
