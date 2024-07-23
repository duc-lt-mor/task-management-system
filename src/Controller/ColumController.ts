import { Member } from '../Models/member';
import { User } from '../Models/user';
import { Project } from '../Models/project';
import { Role } from '../Models/role';
import * as ColumServices from '../Services/ColumServices';
import express from 'express';
import { Colum } from '../Models/colum';
import { Task } from '../Models/task';
import { Op } from 'sequelize';

//khoi tao cot trong project
export const Create = async function (
  req: express.Request,
  res: express.Response,
) {
  //khoi tao cot
  await ColumServices.Create(req);
  res.status(201).send({ message: 'create success' });
};

//chinh sua cot
export const Edit = async function (
  req: express.Request,
  res: express.Response,
) {
  let respons: Array<string> = await ColumServices.Edit(req);
  res.status(200).send(respons);
};

//xoa cot
export const Delete = async function (
  req: express.Request,
  res: express.Response,
) {
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

      await ColumServices.Delete(req);
      res.status(200).send('delete success');
    }
  }
};
export const MoveTask = async function (
  req: express.Request,
  res: express.Response,
) {
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
