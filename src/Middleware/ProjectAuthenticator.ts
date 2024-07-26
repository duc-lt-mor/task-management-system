import { CustomRequest } from '../Middleware/UserAuthenticator';

import { Member } from '../Models/member';

import express from 'express';

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

    if (req.user.role == 'server_admin') {
      next();
      console.log(member);
    }
    if (member?.role_id != 1) {
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
