import { CustomRequest } from '../Middleware/UserAuthenticator';
import { Member } from '../Models/member';
import express from 'express';
import * as Role from '../Constant/Roles';
import { System_role } from '../Models/system_role';
import { Project_role } from '../Models/project_role';
import { Task } from '../Models/task';

export const authenticateCDTask = function (permission: number) {
  return async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      let member: any = await Member.findOne({
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

      let system_role: any = await System_role.findOne({
        where: {
          id: req.user.system_role_id,
        },
      });

      if (system_role.key == Role.ADMIN) {
        next();
      } else if (
        member?.project_role.key == Role.USER ||
        !member?.project_role.permission_keys.permissions.includes(permission)
      ) {
        return res
          .status(403)
          .json({ message: 'You do not have permission to access.' });
      } else {
        next();
      }
    } catch (err) {
      return res.status(500).json({ message: 'Internal error ' });
    }
  };
};

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

      let member: any = Member.findOne({
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

      let system_role: any = System_role.findOne({
        where: {
          id: req.user.system_role_id,
        },
      });

      let task: any = Task.findOne({
        where: {
          id: req.params.task_id,
        },
      });

      await Promise.all([member,system_role,task]);

      if (system_role.key == Role.ADMIN) {
        next();
      } 

      else if (
        member?.project_role.key != Role.USER &&
        member?.project_role.permission_keys.permissions.includes(permission)
      ) {
        next();
      } 

      else if (task.assignee_id == req.user.id) {
        next();
      } 

      else {
        return res
          .status(403)
          .json({ message: 'You do not have permission to access.' });
      }
    } catch (err) {
      return res.status(500).json({ message: 'Internal error ' });
    }
  };
};
