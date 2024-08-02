import { CustomRequest } from '../Middleware/UserAuthenticator';
import express from 'express';
import * as Role from '../Constant/Roles';
import { findMember } from '../Services/MemberServices';
import { Task } from '../Models/task';


export const authenticateUpdateTask = function (permission: number) {
  return async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
      if (req.user?.system_role_id == Role.ADMIN ) {
        next();
      }
      let project_id = req.body.project_id || req.params.project_id;
      let member: any = await findMember(req.user?.id, Number(project_id));
      let task: any = await Task.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (
        task?.creator_id == req.user?.id ||
        member?.project_role.is_pm
      ) {
        next();
      } else if (task?.assignee_id == req.user.id) {
        next();
      } else {
        return res
          .status(403)
          .json({ message: 'You do not have permission to access.' });
      }
    } catch (err) {
      console.log(req.user?.id);
      return res.status(500).json({ message: 'Internal error ' + err });
    }
  };
};

