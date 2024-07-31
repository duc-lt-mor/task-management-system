import { body } from 'express-validator';

export const validateTask = function () {
  return [
    body(`name`).notEmpty().withMessage(`Please enter task name`),
    body(`description`).notEmpty().withMessage(`Please enter task description`),
    body(`priority`).notEmpty().withMessage(`Please insert task priority`),
    body(`expected_end_date`)
      .notEmpty()
      .withMessage(`Please enter desired completion date`),
    body('project_id')
      .notEmpty()
      .withMessage('Please fill in project ID'),
    body('assignee_id')
      .notEmpty()
      .withMessage('Please select an employee to complete the task'),
  ];
};

