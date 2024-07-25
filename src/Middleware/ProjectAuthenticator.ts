import { CustomRequest } from '../Middleware/UserAuthenticator';
import { Project } from '../Models/project';
import { Member } from '../Models/member';
import { Colum } from '../Models/colum';
import express from 'express';
import { User } from '../Models/user';

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
      where: {
        user_id: req.user.id,
        project_id: Number(req.params.project_id),
      },
      include: [
        {
          model: User,
        },
      ],
    });

    if (!member) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to access.' });
    } else {
      if (member.role_id == 1) {
        next();
      } else {
        return res
          .status(403)
          .json({ message: 'You do not have permission to access.' });
      }
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal error' });
  }
};
