import { CustomRequest } from '../Middleware/UserAuthenticator';
import express from 'express';
import * as Role from '../Constant/Roles';
import { findMember } from '../Services/MemberServices';
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
      if(req.user.system_role_id == Role.ADMIN ) {
        next();
      }

      let member: any = await findMember(req.user?.id, Number(req.body.project_id))

      let task: any =await Task.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (
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
      if (req.user?.system_role_id == Role.ADMIN) {
        next();
      } 
      let comment: any = await Comment.findOne({
        where: {
          id: req.params.id,
        },
      });

       if (comment.user_id == req.user.id) {
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