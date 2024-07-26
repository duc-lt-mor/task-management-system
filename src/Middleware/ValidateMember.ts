import { User } from '../Models/user';
import { Member } from '../Models/member';
import * as ProjectServices from '../Services/ProjectServices';
import { Op } from 'sequelize';
import { body } from 'express-validator';

export const addUser = function () {
  return [
    body('find_mem')
      .notEmpty()
      .withMessage('please enter user name/ user email')
      .custom(async (find_mem, { req }) => {
        let project_id: number = Number(req.body.project_id);
        let err: Array<string> = [];

        let user: any = User.findOne({
          where: {
            [Op.or]: [{ name: find_mem }, { email: find_mem }],
          },
        });

        let project: any = ProjectServices.findProjectById(project_id);

        await Promise.all([user, project]);

        let member: any = await Member.findOne({
          where: {
            user_id: user.id,
            project_id: project_id,
          },
        });

        if (!project) {
          //kiem tra project co ton tai hay khong
          throw new Error('project is not exit or already been deleted');
        }

        if (!user) {
          //kiem ta user co ton tai hay khong truoc khi them vao project
          throw new Error('user not exit');
        }

        if (member) {
          //kiem tra xem user da duoc add vao project hay chua
          throw new Error('user already been added');
        }
      }),
    body('project_id').isEmpty().withMessage('please enter project id'),
  ];
};


