import { body } from 'express-validator';

export const addUser = function () {
  return [
    body('project_id')
      .notEmpty()
      .withMessage('please enter project id')
      .isNumeric()
      .withMessage('project_id must be a number'),
    body('project_role_id')
      .notEmpty()
      .withMessage('please enter project role id')
      .isNumeric()
      .withMessage('project_role_id must be a number'),
    body('add_mem')
      .notEmpty()
      .withMessage('please enter user name/ user email')
  ];
};
