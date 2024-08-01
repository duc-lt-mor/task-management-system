import { body, param } from 'express-validator';
import { Member } from '../Models/member';

export const validateRole = function () {
  return [
    body('name').notEmpty().withMessage('Please enter project name'),
    body('permissions')
      .notEmpty()
      .withMessage('please enter at least one permission'),
  ];
};

export const validateDelete = function () {
  return [
    param('role_id').custom(async (role_id) => {
      let id: number = Number(role_id);

      //dem so user co role can xoa
      let users: number = await Member.count({
        where: {
          project_role_id: id,
        },
      });

      if (users > 0) {
        throw new Error(
          'you have change role of all user who has this role to other roles before you delete it',
        );
      }
    }),
  ];
};

export const validateChangeOwnerProject = function () {
  return [
    body('project_id').notEmpty().withMessage('Please enter project id'),
    body('new_owner_id')
      .notEmpty()
      .withMessage('please enter new owner id')
      .custom(async (new_owner_id, { req }) => {
        let member: any = await Member.findOne({
          where: {
            project_id: Number(req.body.project_id),
            user_id: Number(new_owner_id),
          },
        });
        if (!member) {
          throw new Error('user not found');
        }
      }),
  ];
};
