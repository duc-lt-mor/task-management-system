import { CustomRequest } from '../Middleware/UserAuthenticator';
import { Member } from '../Models/member';
import express from 'express';
import * as Role from '../Constant/Roles';
import { Project_role } from '../Models/project_role';
import { Task } from '../Models/task';
import { Comment } from '../Models/comment';

export const authenticateCreateComment = function (permission: number) {
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

      let task_found: any = Task.findOne({
        where: {
          id: req.body.task_id,
        },
      });

      let [member, task] = await Promise.all([member_found, task_found]);

      if (
        req.user.system_role_id == Role.ADMIN ||
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

export const authenticateUDComment = function (permission: number) {
  return async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      let comment: any = await Comment.findOne({
        where: {
          id: req.body.task_id,
        },
      });

      if (req.user?.system_role_id == Role.ADMIN) {
        next();
      } else if (comment.user_id == req.user.id) {
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