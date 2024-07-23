import { Member } from '../Models/member';
import { User } from '../Models/user';
import { Project } from '../Models/project';
import { Role } from '../Models/role';
import {
  validateProject,
  createProject,
  getProjectById,
  editProject,
  deleteProject,
  addMember,
  removeMember,
  editMemRole,
  createColum,
  validateColum,
  editColum,
  deleteColum,
} from '../Services/services';
import express from 'express';
import { Colum } from '../Models/colum';
import { Task } from '../Models/task';
const { Op } = require('sequelize');
//khoi tao project
export const create_project = async (
  req: express.Request,
  res: express.Response,
) => {
  let name: string = req.body.name;
  let key: string = req.body.key;
  let decripstion: string = req.body.decripstion;
  let creator_id: number = req.body.creator_id;
  let expected_end_date: string = req.body.expected_end_date;
  let create_date: Date = new Date(expected_end_date);
  let trim_name: string = name.trim();
  let trim_key: string = key.trim();
  //xac thuc du lieu dau vao
  let err = await validateProject(trim_name, trim_key, create_date);
  if (err.length > 0) {
    res.status(400).send({ message: err });
  } else {
    await createProject(
      trim_name,
      trim_key,
      decripstion,
      creator_id,
      create_date,
    );
    res.status(201).send({ message: 'create success' });
  }
};
//sua project
export const edit_project = async (
  req: express.Request,
  res: express.Response,
) => {
  let id: number = Number(req.params.projectid);
  let name: string = req.body.name;
  let decripstion: string = req.body.decripstion;
  let expected_end_date: string = req.body.expected_end_date;
  let create_date: Date = new Date(expected_end_date);
  let current_date: Date = new Date();
  let project: any = await getProjectById(id);

  if (!project) {
    res.status(404).send('project not exit');
  } else if (project.name === name) {
    res.status(400).send('project name has already been used');
  } else if (create_date < current_date || isNaN(create_date.getTime())) {
    res.status(400).send(`expected end date must later than ${current_date}`);
  } else {
    await editProject(name, decripstion, create_date, id);
    res.status(201).send({ message: 'update success' });
  }
};
//xoa project
export const delete_project = async (
  req: express.Request,
  res: express.Response,
) => {
  let id: number = Number(req.params.projectid);
  let project: any = await getProjectById(id);

  if (!project) {
    //kiem tra xem project co on tai hay khong
    res.status(404).send('project is not exit or already been deleted');
  } else {
    await deleteProject(id);
    res.status(201).send({ message: 'delete success' });
  }
};
//them thanh vien
export const add_member = async (
  req: express.Request,
  res: express.Response,
) => {
  let project_id: number = Number(req.params.projectid);
  let find_mem: string = req.body.find_mem;
  let role_id: number = Number(req.body.role_id);
  let user: any = await User.findOne({
    where: {
      [Op.or]: [{ name: find_mem }, { email: find_mem }],
    },
  });
  let project: any = await getProjectById(project_id);
  let member: any = await Member.findOne({
    where: {
      user_id: user.id,
      project_id: project_id,
    },
  });
  if (!project) {
    //kiem tra project co ton tai hay khong
    res.status(404).send('project is not exit or already been deleted');
  } else if (!user) {
    //kiem ta user co ton tai hay khong truoc khi them vao project
    res.status(404).send('user not exit');
  } else if (member) {
    //kiem tra xem user da duoc add vao project hay chua
    res.status(400).send('user already been added');
  } else {
    await addMember(project_id, user.id, role_id);
    res.status(200).send('add member success');
  }
};
//xoa member khoi project
export const remove_member = async (
  req: express.Request,
  res: express.Response,
) => {
  let project_id: number = Number(req.params.projectid);
  let user_id: number = Number(req.body.user_id);
  let member: any = await Member.findOne({
    where: {
      user_id: user_id,
      project_id: project_id,
    },
  });
  if (!member) {
    //kiem tra xem member da bi xoa khoi project hay chua
    res.status(404).send('user already been remove');
  } else {
    await removeMember(user_id, project_id);
    res.status(201).send('remove member success');
  }
};
//thay doi role cua member trong project
export const edit_member_role = async (
  req: express.Request,
  res: express.Response,
) => {
  let project_id: number = Number(req.params.projectid);
  let user_id: number = Number(req.body.user_id);
  let role_id: number = Number(req.body.role_id);
  let member: any = await Member.findOne({
    where: {
      user_id: user_id,
      project_id: project_id,
    },
  });
  if (!member) {
    //kiem tra xem member co trong project hay khong
    res.status(404).send('user already has been remove');
  } else {
    await editMemRole(project_id, user_id, role_id);
    res.status(201).send('edit member role success');
  }
};
//xem danh sach thanh vien
export const show_member = async (
  req: express.Request,
  res: express.Response,
) => {
  let project_id: number = Number(req.params.projectid);
  let members: any = await Member.findAll({
    where: {
      project_id: project_id,
    },
    attributes: {
      exclude: ['id'],
    },
    include: [
      {
        model: User,
      },
    ],
  });
  res.status(200).send(members);
};
//khoi tao cot trong project
export const create_colum = async (
  req: express.Request,
  res: express.Response,
) => {
  let project_id: number = Number(req.params.projectid);
  let col_type: string = req.body.col_type;
  let name: string = req.body.col_name;
  let index: number = Number(req.body.col_index);
  //dem so cot hien tai trong project
  let last_index: number = await Colum.count({
    where: {
      project_id: project_id,
    },
  });
  //xac thuc du lieu dau vao cua project
  let err = await validateColum(col_type, name, project_id);
  if (err.length > 0) {
    res.status(400).send({ message: err });
  } else {
    if (isNaN(index) || index <= 0) {
      //kiem tra xem cot co vi tri khi khoi tao khong
      index = last_index + 1;
    } else {
      //tang gia tri col_index cua cac cot tu cuoi den vi tri khoi tao
      for (let i: number = last_index; i >= index; i--) {
        let col1: any = await Colum.findOne({
          where: {
            [Op.and]: [{ col_index: i }, { project_id: project_id }],
          },
        });
        await col1.update({
          col_index: i + 1,
        });
      }
    }
    //khoi tao cot
    await createColum(col_type, name, index, project_id);
    res.status(201).send({ message: 'create success' });
  }
};
//chinh sua cot
export const edit_colum = async (
  req: express.Request,
  res: express.Response,
) => {
  let project_id: number = Number(req.params.projectid);
  let col_type: string = req.body.col_type;
  let name: string = req.body.col_name;
  let index: number = Number(req.body.col_index);
  let col_id: number = Number(req.body.col_id);

  let respons: Array<string> = await editColum(
    col_type,
    name,
    index,
    col_id,
    project_id,
  );
  res.status(200).send(respons);
};
//xoa cot
export const delete_colum = async (
  req: express.Request,
  res: express.Response,
) => {
  let col_id: number = Number(req.params.col_id);
  //dem so task hien co trong mot cot
  let tasknum: number = await Task.count({
    where: {
      colum_id: col_id,
    },
  });
  //lay ra thong tin cot can xoa
  let colum: any = await Colum.findOne({
    where: {
      id: col_id,
    },
  });
  if (colum.col_type != 'custom') {
    //kiem tra xem cot can xoa co phai cot default khong
    res.status(400).send("you can't delete default colum");
  } else {
    if (tasknum > 0) {
      //kiem tra xem con task nao trong cot khong
      res
        .status(400)
        .send(
          'you have move all tasks of this colum to other colum before you delete it',
        );
    } else {
      //dem so luong task trong 1 project
      let last_index: number = await Colum.count({
        where: {
          project_id: colum.project_id,
        },
      });
      //giam gia tri index cua cac cot o cuoi den vi tri cua cot can xoa
      for (let i: number = last_index; i >= colum.col_index; i--) {
        let col1: any = await Colum.findOne({
          where: {
            [Op.and]: [{ col_index: i }, { project_id: colum.project_id }],
          },
        });
        await col1.update({
          col_index: i - 1,
        });
      }

      await deleteColum(col_id);
      res.status(200).send('delete success');
    }
  }
};
export const move_task = async (
  req: express.Request,
  res: express.Response,
) => {
  let col_id: number = Number(req.params.col_id);
  let new_col: number = Number(req.body.new_col);
  if (isNaN(new_col) || new_col <= 0) {
    //kiem tra xem co vi tri moi cho cac task khong
    let colum2: any = await Colum.findOne({
      where: {
        col_index: 1,
      },
    });
    new_col = colum2.id;
  }
  await Task.update(
    //cap nhat vi tri cua cac task
    { colum_id: new_col },
    {
      where: {
        colum_id: col_id,
      },
    },
  );
  res.status(200).send('move task success');
};
