import { Member } from '../Models/member';
import { User } from '../Models/user';
import { Project } from '../Models/project';
import { Role } from '../Models/role';
import * as ProjectServices from '../Services/ProjectServices';
import express from 'express';
import { Colum } from '../Models/colum';
import { Task } from '../Models/task';
import  Op   from 'sequelize';



//khoi tao cot trong project
export const create = async function (
    req: express.Request,
    res: express.Response,
  ) {
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
  export const edit = async function (
    req: express.Request,
    res: express.Response,
  ) {
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
  
        await deleteColum(col_id);
        res.status(200).send('delete success');
      }
    }
  };
  export const move = async function (
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