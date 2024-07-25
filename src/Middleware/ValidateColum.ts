import { Colum } from '../Models/colum';
import { Task } from '../Models/task';
import express from 'express';
import { Op } from 'sequelize';
import { body, param } from 'express-validator';

export const validateCreate = function () {
  return [
    body('name').custom(async (name, { req }) => {
      // Check if 'name' is not empty before querying the database
      if (!name) {
        throw new Error('please enter column name'); // Add message for empty name
      }

      let colum: any = await Colum.findOne({
        where: {
          name: name.replace(/\s+/g, ' ').trim(),
          project_id: Number(req.body.project_id),
        },
      });

      if (colum) {
        throw new Error('name already been used');
      }
    }),
  ];
};

export const validateUpdate = function () {
  return [
    body('project_id').custom(async (project_id, { req }) => {
      // Check if project_id is not a number
      if (isNaN(req.body.project_id) || !req.body.project_id) {
        throw new Error('Project ID must be a number');
      }

      // Check for column name uniqueness within the same project, excluding the current column ID
      const check_name = await Colum.findOne({
        where: {
          name: req.body.name.replace(/\s+/g, ' ').trim(),
          project_id: Number(project_id),
          id: { [Op.ne]: Number(req.params?.col_id) },
        },
      });

      if (check_name) {
        throw new Error('Column name already in use within the project');
      }
    }),
  ];
};

export const validateDelete = function () {
  return [
    param('col_id').custom(async (col_id) => {
      let id: number = Number(col_id);

      //dem so task hien co trong mot cot
      let tasks: number = await Task.count({
        where: {
          colum_id: id,
        },
      });

      //lay ra thong tin cot can xoa
      let colum: any = await Colum.findOne({
        where: {
          id: id,
        },
      });

      await Promise.all([tasks, colum]);

      if (colum.col_type != 'custom') {
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
