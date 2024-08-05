import { CustomRequest } from '../Middleware/UserAuthenticator';
import express from 'express';
import * as Role from '../Constant/Roles';
import { findMember } from '../Services/MemberServices';

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
      if (req.user?.system_role_id == Role.ADMIN) {
        next();
        return;
      }
      let project_id =
        req.body.project_id || req.params.project_id || req.query.project_id;
      let member: any = await findMember(req.user?.id, Number(project_id));

      if (
        member?.project_role.permissions.includes(permission) ||
        member?.project_role.is_pm
      ) {
        next();
      } else {
        return res.status(403).json({
          message: 'You do not have permission to access.',
        });
      }
    } catch (err) {
      return res.status(500).json({ message: 'Internal error ' });
    }
  };
};
