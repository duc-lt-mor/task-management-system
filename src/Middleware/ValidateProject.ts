import { Project } from '../Models/project';
import { Op } from 'sequelize';
import { body } from 'express-validator';
import * as express from 'express'

export const validateCreate = function () {
  return [
    body('name').notEmpty().withMessage("Please enter project name").trim().custom(async (name) => {

      let project_found = await Project.findOne({
        where: {
          name: name,
        },
      });

      if (project_found) {
        throw new Error( 'project name already been used');
      }
    }),

    body('key').notEmpty().withMessage('Please enter project key').trim().custom(async (key) => {

      let project_found = await Project.findOne({
        where: {
          key: key,
        },
      });

      if (project_found) {
        throw new Error('project key already been used');
      }
    }),

    body('expected_end_date').custom(async (expected_end_date) => {
      validateExpectED(expected_end_date)
    }),
  ];
}


export const validateUpdate = function (

) {
  return [
    body('name').custom(async (name, { req }) => {
      let project_found = await Project.findOne({
        where: {
          name: name,
          id: { [Op.ne]: req.params?.project_id },
        },
      });

      if (project_found) {
        throw new Error('project name already been used');
      }
    }),

    body('expected_end_date').custom(async (expected_end_date) => {
      validateExpectED(expected_end_date)
    }),
  ];
};

const validateExpectED = (expected_end_date: string) => {
  if (!expected_end_date) {
    throw new Error('please enter expected_end_date');
  }

  let create_date: Date = new Date(expected_end_date);
  let current_date: Date = new Date();

  if (create_date < current_date || isNaN(create_date.getTime())) {
    throw new Error(`expected end date must later than ${current_date}`);
  }
}