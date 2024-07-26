import { Project } from '../Models/project';
import { Op } from 'sequelize';
import { body } from 'express-validator';

export const validateCreate = function () {
  return [
    body('name').custom(async (name) => {
      if (!name) {
        throw new Error('Please enter project name');
      }

      let trim_name: string = name.replace(/\s+/g, ' ').trim();
      let project_found = await Project.findOne({
        where: {
          name: trim_name,
        },
      });

      if (project_found) {
        throw new Error('project name already been used');
      }
    }),

    body('key').custom(async (key) => {
      if (!key) {
        throw new Error('Please enter project key');
      }

      let trim_key: string = key.trim();
      let project_found = await Project.findOne({
        where: {
          key: trim_key,
        },
      });

      if (project_found) {
        throw new Error('project key already been used');
      }
    }),

    body('expected_end_date').custom(async (expected_end_date) => {
      if (!expected_end_date) {
        throw new Error('please enter expected_end_date');
      }

      let create_date: Date = new Date(expected_end_date);
      let current_date: Date = new Date();

      if (create_date < current_date || isNaN(create_date.getTime())) {
        throw new Error(`expected end date must later than ${current_date}`);
      }
    }),
  ];
};

//xac thuc du lieu dau vao cho sua project
export const validateUpdate = function () {
  return [
    body('name').custom(async (name, { req }) => {
      let trim_name: string = name.trim();
      let project_found = await Project.findOne({
        where: {
          name: trim_name,
          id: { [Op.ne]: req.params?.project_id },
        },
      });

      if (project_found) {
        throw new Error('project name already been used');
      }
    }),

    body('expected_end_date').custom(async (expected_end_date) => {
      if (!expected_end_date) {
        throw new Error('please enter expected_end_date');
      }

      let create_date: Date = new Date(expected_end_date);
      let current_date: Date = new Date();

      if (create_date < current_date || isNaN(create_date.getTime())) {
        throw new Error(`expected end date must later than ${current_date}`);
      }
    }),
  ];
};
