import { CustomRequest } from '../Middleware/UserAuthenticator';
import { Member } from '../Models/member';
import express from 'express';
import * as Role from '../Constant/Roles';
import { System_role } from '../Models/system_role';
import { Project_role } from '../Models/project_role';

export const authenticateProject = function (permission: number) {
  return async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      let member_found: any =  Member.findOne({
        where: {
          user_id: req.user.id,
          project_id:
            Number(req.params.project_id) || Number(req.body.project_id),
        },
        include: [
          {
            model: Project_role,
          },
        ],
      });

      let system_role_found: any =  System_role.findOne({
        where: {
          id: req.user.system_role_id,
        },
      });

     let [member, system_role] = await Promise.all([member_found,system_role_found]);

      if (system_role?.key == Role.ADMIN) {
        next();
      } else if (
        member?.project_role.key != Role.PM ||
        !member?.project_role.permission_keys.permissions.includes(permission)
      ) {
        return res
          .status(403)
          .json({ message: 'You do not have permission to access.' });
      } else {
        next();
      }
    } catch (err) {
      return res.status(500).json({ message: 'Internal error '});
    }
  };
};
