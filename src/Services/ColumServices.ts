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
import  {Op}   from 'sequelize';


//xoa project
export const Delete = async function (req: express.Request)  {
    // xoa cac thanh vien khoi project
    await Member.destroy({
      where: {
        project_id: Number(req.params.project_id),
      },
    });
  
    //xoa cac cot co trong project
    await Colum.destroy({
      where: {
        project_id: Number(req.params.project_id),
      },
    });
  
    //xoa project
    await Project.destroy({
      where: {
        id: Number(req.params.project_id),
      },
    });
  };
  
  //tao cot
  export const create = async function (req: express.Request) {
    await Colum.create({
      type: req.body.type,
      name: req.body.name,
      index: req.body.index,
      project_id: req.body.project_id,
    });
  };
  
  //chinh sua cot
  export const Edit = async function (
    col_type: string,
    name: string,
    index: number,
    col_id: number,
    project_id: number,
  ) {
    let respons: Array<string> = [];
    //lay ra cot can sua
    let colum: any = await Colum.findOne({
      where: {
        id: col_id,
      },
    });
    //tim trong bang xem co cot nao thuoc cung project co ten bi trung voi ten vua nhap hay khong
    let colum2: any = await Colum.findOne({
      where: {
        name: name ,
        project_id: project_id ,
        id: { [Op.ne]: col_id } ,
      },
    });
  
    if (colum2) {
      respons.push('colum name already been used');
    } else {
      if (!name) {
        respons.push('colum name remain');
      } else if (name === colum.name) {
        respons.push('colum name remain');
      } else {
        await colum.update({
          name: name,
        });
        respons.push('colum name updated');
      }
    }
  
    if (!col_type) {
      respons.push('colum type remain');
    } else if (col_type === colum.col_type) {
      respons.push('colum type remain');
    } else {
      await colum.update({
        col_type: col_type,
      });
      respons.push('colum type updated');
    }
  
    if (isNaN(index)) {
      respons.push('colum index remain');
    } else if (index == colum.col_index || index <= 0) {
      respons.push('colum index remain');
    } else {
      //neu vi tri moi nho hon vi tri hien tai
      if (index < colum.col_index) {
        //tang gia tri col_index cua cac cot tu vi tri hien tai den vi tri moi
        for (let i: number = colum.col_index - 1; i >= index; i--) {
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
      //neu vi tri moi lon hon vi tri hien tai
      else {
        //giam gia tri col_index cua cac cot tu vi tri hien tai den vi tri moi
        for (let i: number = colum.col_index + 1; i <= index; i++) {
          let col1: any = await Colum.findOne({
            where: {
              [Op.and]: [{ col_index: i }, { project_id: project_id }],
            },
          });
          await col1.update({
            col_index: i - 1,
          });
        }
      }
  
      await colum.update({
        col_index: index,
      });
      respons.push('colum index updated');
    }
  
    return respons;
  };
  
  //xoa cot
  export const deleteColum = async function (id: number) {
    await Colum.destroy({
      where: {
        id: id,
      },
    });
  };