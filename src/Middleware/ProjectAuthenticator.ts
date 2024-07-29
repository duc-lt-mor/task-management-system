import { CustomRequest } from '../Middleware/UserAuthenticator';
import { Member } from '../Models/member';
import express from 'express';
import * as Roles from '../Constant/Constant'

export const authenticateProject = async function (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    let member: any = await Member.findOne({
      attributes: ['role_id'],
      where: {
        user_id: req.user.id,
        project_id: Number(req.params.project_id || req.body.project_id),
      },
    });

    if (req.user.system_role_id == Roles.ADMIN) {
      next();
    }
    if (member?.role_id != Roles.PROJECT_MANAGER) {
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
