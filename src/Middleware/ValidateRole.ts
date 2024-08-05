import { body, param } from 'express-validator';
import { Member } from '../Models/member';
import { PERMISSIONS, PM_PERMISSIONS } from '../Constant/Permissions';
import { Project_role } from '../Models/project_role';

export const validateRole = function () {
  return [
    body('name').notEmpty().withMessage('Please enter role name'),
    body('permissions')
      .notEmpty()
      .withMessage('please enter at least one permission')
      .custom((permissions) => {
        let err = [];
        let arr = JSON.parse(`[${permissions}]`);
        for (let p of arr) {
          if (!PERMISSIONS.includes(Number(p))) {
            err.push(p + ' is not exit in permissions');
          }
          
        }
        if (arr.includes(PM_PERMISSIONS)) {
          err.push('you can not have pm permission');
        }
        if (err.length > 0) {

          throw err;
        }
      }),
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
          throw new Error('user is not in this project');
        }
      }),
    body('new_project_role_id')
      .notEmpty()
      .withMessage('please enter new project role id')
      .custom(async (new_project_role_id) => {
        let role: any = await Project_role.findOne({
          where: {
            id: Number(new_project_role_id),
          },
        });
        if (role.is_pm) {
          throw new Error('you can not chose pm role');
        }
      }),
  ];
};
