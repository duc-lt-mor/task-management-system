import { Project_role } from "../Models/project_role";
import { Op } from 'sequelize';
import { body, param } from 'express-validator';

export const validateRole = function () {
    return [
        body('name').notEmpty().withMessage("Please enter project name"),
        body('key').notEmpty().withMessage('Please enter project key from one of those key [pm,leader,user]'),
        body('permission_keys').notEmpty().withMessage("please enter at least one permission")
    ]
}

export const validateDelete = function () {
    return [
        param('role_id').custom(async (role_id) => {
            let id: number = Number(role_id);
      
            //dem so user co role can xoa
            let users: any =  Project_role.count({
              where: {
                id: id,
              },
            });
      
            //lay ra thong tin cot can xoa
            let colum: any = Colum.findOne({
              where: {
                id: id,
              },
            });
      
            await Promise.all([tasks, colum]);
      
            if (colum.col_type != 'custom') {
              //kiem tra xem cot can xoa co phai cot default khong
              throw new Error("you can't delete default colum");
            }
      
            if (tasks > 0) {
              //kiem tra xem con task nao trong cot khong
              throw new Error(
                'you have move all tasks of this colum to other colum before you delete it',
              );
            }
          }),

    ]
}