import { body } from 'express-validator';

export const validateRegister = function () {
  return [
    body(`name`).notEmpty().withMessage(`Please enter your name`),
    body(`email`).notEmpty().withMessage(`Please enter your email`),
    body(`password`).notEmpty().withMessage(`Please enter your password`),
    body(`password_confirm`)
      .notEmpty()
      .withMessage(`Please enter your confirmation password`)
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Password and confirmation password must match'),
    body('phone_number')
      .notEmpty()
      .withMessage('Please fill in the right number format'),
    body('system_role_id')
      .notEmpty()
      .withMessage('Please select a system role'),
  ];
};

export const validateLogin = function () {
  return [
    body(`email`).notEmpty().withMessage(`Please enter your email`),
    body(`password`).notEmpty().withMessage(`Please enter your password`)
  ]
}
