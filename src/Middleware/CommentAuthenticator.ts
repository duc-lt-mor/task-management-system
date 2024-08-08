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
      if (req.user.system_role_id == Role.ADMIN) {
        next();
        return;
      }
      let task:any = []
      if (!isNaN(req.body.task_id)) {
        task = await Task.findByPk(req.body.task_id);
      } 
      else {
        let comment: any = await Comment.findByPk(req.body.parent_id);
        task = await Task.findByPk(comment.task_id);
      }
      
      if (!task) {
        throw new Error('Task not found')
      }
      let member: any = await findMember(req.user?.id, task?.project_id);

      if (
        member?.project_role.permissions.includes(permission) ||
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
      console.log(err);
      return res.status(500).json({ message: 'Internal error ' + err });
    }
  };
};

export const authenticateUDComment = function () {
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
