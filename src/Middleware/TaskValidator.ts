import { body } from 'express-validator';

export const validateTask = function () {
  return [
    body(`name`).notEmpty().withMessage(`Please enter task name`),
    body(`description`).notEmpty().withMessage(`Please enter task description`),
    body(`priority`).notEmpty().withMessage(`Please insert task priority`),
    body('start_date').notEmpty().withMessage('Please enter the start date'),
    body('expected_end_date')
      .notEmpty()
      .withMessage('Please enter the desired completion date')
      .custom((value, { req }) => {
        const start_date = new Date(req.body.start_date);
        const end_date = new Date(value);
        if (start_date >= end_date) {
          throw new Error(
            'Expected end date must be greater than the start date',
          );
        }
        return true;
      }),
    body('assignee_id')
      .notEmpty()
      .withMessage('Please select an employee to complete the task'),
  ];
};
