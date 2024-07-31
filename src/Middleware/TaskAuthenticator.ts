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

      let member_found: any = Member.findOne({
        where: {
          user_id: req.user.id,
          project_id: Number(req.body.project_id),
        },
        include: [
          {
            model: Project_role,
          },
        ],
      });

      let system_role_found: any = System_role.findOne({
        where: {
          id: req.user.system_role_id,
        },
      });

      let [member, system_role] = await Promise.all([
        member_found,
        system_role_found,
      ]);

      if (
        system_role?.key == Role.ADMIN ||
        member?.project_role.permissions.includes(permission) ||
        member?.project_role.permissions.includes(0)
      ) {
        next();
      } else {
        return res
          .status(403)
          .json({ message: 'You do not have permission to access.' });
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

      let member_found: any = Member.findOne({
        where: {
          user_id: req.user.id,
          project_id: Number(req.body.project_id),
        },
        include: [
          {
            model: Project_role,
          },
        ],
      });

      let system_role_found: any = System_role.findOne({
        where: {
          id: req.user.system_role_id,
        },
      });

      let task_found: any = Task.findOne({
        where: {
          id: req.params.task_id,
        },
      });

      let [member, system_role, task] = await Promise.all([
        member_found,
        system_role_found,
        task_found,
      ]);

      if (
        system_role?.key == Role.ADMIN ||
        member?.project_role.permissions.includes(permission) ||
        member?.project_role.permissions.includes(0)
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
      return res.status(500).json({ message: 'Internal error ' });
    }
  };
};
