import { System_role } from '../Models/system_role';
import { Role } from '../Models/role';
import { User } from '../Models/user';
import { Project } from '../Models/project';
import { Task } from '../Models/task';
import { Comment } from '../Models/comment';
import { Login } from '../Models/login';
import { Member } from '../Models/member';
import { Colum } from '../Models/colum';
import express from 'express';
import { Op } from 'sequelize';

//tao cot
export const Create = async function (req: express.Request) {
  await Colum.create({
    type: req.body.type,
    name: req.body.name,
    index: Number(req.body.index),
    project_id: Number(req.body.project_id),
  });
};

//chinh sua cot
export const Edit = async function (req: express.Request) {
  let respons: Array<string> = [];
  //lay ra cot can sua
  let colum: any = await Colum.findOne({
    where: {
      id: Number(req.params.col_id),
    },
  });
  //tim trong bang xem co cot nao thuoc cung project co ten bi trung voi ten vua nhap hay khong
  let colum2: any = await Colum.findOne({
    where: {
      name: req.body.name,
      project_id: Number(req.body.project_id),
      id: { [Op.ne]: Number(req.params.col_id) },
    },
  });

  if (colum2) {
    respons.push('colum name already been used');
  } else {
    if (!req.body.name) {
      respons.push('colum name remain');
    } else if (req.body.name === colum.name) {
      respons.push('colum name remain');
    } else {
      await colum.update({
        name: req.body.name,
      });
      respons.push('colum name updated');
    }
  }

  if (!req.body.col_type) {
    respons.push('colum type remain');
  } else if (req.body.col_type === colum.col_type) {
    respons.push('colum type remain');
  } else {
    await colum.update({
      col_type: req.body.col_type,
    });
    respons.push('colum type updated');
  }

  if (isNaN(Number(req.body.index))) {
    respons.push('colum index remain');
  } else if (
    Number(req.body.index) == colum.col_index ||
    Number(req.body.index) <= 0
  ) {
    respons.push('colum index remain');
  } else {
    //neu vi tri moi nho hon vi tri hien tai
    if (Number(req.body.index) < colum.col_index) {
      //tang gia tri col_index cua cac cot tu vi tri hien tai den vi tri moi
      for (
        let i: number = colum.col_index - 1;
        i >= Number(req.body.index);
        i--
      ) {
        let col1: any = await Colum.findOne({
          where: {
            [Op.and]: [
              { col_index: i },
              { project_id: Number(req.body.project_id) },
            ],
          },
        });
        await col1.update({
          col_index: i + 1,
        });
      }
    }
    //neu vi tri moi lon hon vi tri hien tai
    else {
      //giam gia tri col_index cua cac cot tu vi tri hien tai den vi tri moi
      for (
        let i: number = colum.col_index + 1;
        i <= Number(req.body.index);
        i++
      ) {
        let col1: any = await Colum.findOne({
          where: {
            [Op.and]: [
              { col_index: i },
              { project_id: Number(req.body.project_id) },
            ],
          },
        });
        await col1.update({
          col_index: i - 1,
        });
      }
    }

    await colum.update({
      col_index: Number(req.body.index),
    });
    respons.push('colum index updated');
  }

  return respons;
};

//xoa cot
export const Delete = async function (req: express.Request) {
  await Colum.destroy({
    where: {
      id: Number(req.params.id),
    },
  });
};
