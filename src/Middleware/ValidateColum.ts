import  Op   from 'sequelize';
import { Colum } from '../Models/colum';

//kiem tra du lieu dau vao cua cot
export const validateColum = async function (
    type: string,
    name: string,
    project_id: number,
  ) {
    let err: Array<string> = [];
    if (!type) {
      err.push('please enter colum type');
    }
    if (!name) {
      err.push('please enter colum name');
    }
    let colum: any = await Colum.findOne({
      where: {
         name: name , 
         project_id: project_id ,
      },
    });
    if (colum) {
      err.push('colum name already exit');
    }
    return err;
  };