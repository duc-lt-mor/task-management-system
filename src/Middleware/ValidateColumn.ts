import { Column } from '../Models/column';
import { Task } from '../Models/task';
import { Op } from 'sequelize';
import { body, param } from 'express-validator';
import createHttpError from 'http-errors';

export const validateCreate = function () {
  return [
    body('name')
      .notEmpty()
      .trim()
      .custom(async (name, { req }) => {
        let column = await Column.findOne({
          where: {
            name: name.toLowerCase(),
            project_id: Number(req.body.project_id),
          },
        });

        if (column) {
          throw new Error('name already been used');
        }
      }),
  ];
};

export const validateUpdate = function () {
  return [
    body('project_id').custom(async (project_id, { req }) => {
      if (isNaN(req.body.project_id)) {
        throw new Error('Project ID must be a number');
      }

      const check_name = await Column.findOne({
        where: {
          name: req.body.name,
          project_id: Number(project_id),
          id: { [Op.ne]: Number(req.params?.col_id) },
        },
      });

      if (check_name) {
        throw new Error('Column name already in use within the project');
      }
    }),
    body('array_index')
      .customSanitizer((arrayStr) => {
        return JSON.parse(`[${arrayStr}]`) as { id: number; index: number }[];
      })
      .custom(async (array_index: { id: number; index: number }[], { req }) => {
        const count = await Column.count({
          where: {
            project_id: req.body.project_id,
          },
        });
        array_index
          .map((value) => {
            if (value.index > count || value.index < 1) {
              throw createHttpError(400, 'Invalid column index');
            }
            return value;
          })
          .sort((a, b) => {
            if (a.index === b.index) {
              throw createHttpError(400, 'Duplicate column index');
            }

            return a.index - b.index;
          });
      }),
  ];
};

export const validateDelete = function () {
  return [
    param('col_id').custom(async (col_id) => {
      let id: number = Number(col_id);

      //dem so task hien co trong mot cot
      let tasks_count: any = Task.count({
        where: {
          column_id: id,
        },
      });

      //lay ra thong tin cot can xoa
      let colum_found: any = Column.findOne({
        where: {
          id: id,
        },
      });

      let [tasks, colum] = await Promise.all([tasks_count, colum_found]);

      if (colum?.col_type != 'custom') {
        //kiem tra xem cot can xoa co phai cot default khong
        throw new Error("you can't delete default colum");
      }

      if (tasks > 0) {
        //kiem tra xem con task nao trong cot khong
        throw new Error(
          'you have move all tasks of this colum to other colum before you delete it',
        );
      }
    }),
  ];
};
