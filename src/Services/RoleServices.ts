
import { RoleData } from '../Interfaces/RoleInterface';
import { sequelize } from '../Config/config';
import { validationResult } from 'express-validator';
import express from 'express';
import createHttpError from 'http-errors';
import { Project_role } from '../Models/project_role';


export const findRoleById = async (id: number) => {
    let project = await Project_role.findOne({
      where: {
        id: id,
      },
    });
    return project;
  };
  

export const create = async function (req: express.Request, data: RoleData) {
    const t = await sequelize.transaction();
  
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((e: any) => e.msg);
        const error = createHttpError(400, JSON.stringify(errorMessages,null, 2));
        throw error;
      }
       await Project_role.create(
        {
          name: data.name,
          key: data.key,
          project_id: data.project_id,
          permission_keys: data.permissions,
        },
        { transaction: t },
      );
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  };
  
  export const edit = async function (
    id: number,
    req: express.Request,
    data: RoleData,
  ) {
    const t = await sequelize.transaction();
    let role: any = await findRoleById(id);
  
    if (!data.name) {
      data.name = role.name;
    }
  
    try {
    //   const errors = validationResult(req);
  
    //   if (!errors.isEmpty()) {
    //     const errorMessages = errors.array().map((e: any) => e.msg);
    //     const error = createHttpError(400, JSON.stringify(errorMessages,null, 2));
    //     throw error;
    //   }
      await Project_role.update(
        {
          name: data.name,
          permissions: data.permissions,
        },
        { where: { id: id }, transaction: t },
      );
  
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  };