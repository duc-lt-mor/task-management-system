import { Colum } from '../Models/colum';
import { Task } from '../Models/task';
import { Op } from 'sequelize';
import { body, param } from 'express-validator';

export const validateCreate = function () {
  return [
    body('name')
      .notEmpty()
      .trim()
      .custom(async (name, { req }) => {
        
        let colum: any = await Colum.findOne({
          where: {
            name: name.toLowerCase(),
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
      if (isNaN(req.body.project_id)) {
        throw new Error('Project ID must be a number');
      }

      const check_name = await Colum.findOne({
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
  ];
};

export const validateDelete = function () {
  return [
    param('col_id').custom(async (col_id) => {
      let id: number = Number(col_id);

      //dem so task hien co trong mot cot
      let tasks_count: any = Task.count({
        where: {
          colum_id: id,
        },
      });

      //lay ra thong tin cot can xoa
      let colum_found: any = Colum.findOne({
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
