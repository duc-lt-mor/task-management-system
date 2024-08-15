import { Column } from '../Models/column';
import { Op } from 'sequelize';
import { ColumnData } from '../Interfaces/ColumnInterface';
import { sequelize } from '../Config/config';
import { validationResult } from 'express-validator';
import express from 'express';
import createHttpError from 'http-errors';

export const create = async function (data: ColumnData, req: express.Request) {
  const t = await sequelize.transaction();

  let cols: number = await Column.count({
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
    let column: any = await Column.create(
      {
        col_type: 'custom',
        name: data.name.toLowerCase(),
        col_index: cols + 1,
        project_id: data.project_id,
      },
      { transaction: t },
    );
    await t.commit();
    return column;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

export const get = async function (id: number) {
  const columns = await Column.findAll({where: {project_id: id}})
  return columns
}

export const edit = async function (
  id: number,
  data: ColumnData,
  req: express.Request,
) {
  const t = await sequelize.transaction();
  let indexs = data.array_index;
  // let indexs = JSON.parse(`[${data.array_index}]`);
  //lay ra cot can sua
  let column: any = await Column.findOne({
    where: {
      id: id,
    },
  });

  if (!data.name) {
    data.name = column.name;
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
        indexs.map(async (inde: any) =>
          Column.update(
            { col_index: inde.index },
            { where: { id: inde.id }, transaction: t },
          ),
        ),
      ),

      await Column.update(
        {
          name: data.name.toLowerCase(),
        },
        { where: { id: id }, transaction: t },
      ),
    ]);

    await t.commit();
    let colum_updated: any = await Column.findOne({
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

  let column: any = await Column.findOne({
    where: {
      id: id,
    },
  });

  //dem so luong task trong 1 project
  let last_index: number = await Column.count({
    where: {
      project_id: column.project_id,
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
    for (let i: number = last_index; i >= column.col_index; i--) {
      let col: any = await Column.findOne({
        where: {
          [Op.and]: [{ col_index: i }, { project_id: column.project_id }],
        },
      });

      await col.update(
        {
          col_index: i - 1,
        },
        { transaction: t },
      );
    }

    await Column.destroy({
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