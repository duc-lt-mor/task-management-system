import { Colum } from '../Models/colum';
import { Op } from 'sequelize';
import { ColumData } from '../Interfaces/ColumInterface';


export const Create = async function (data: ColumData) {
  try {
    await Colum.create({
      type: data.type,
      name: data.name,
      index: data.index,
      project_id: data.project_id,
    });
  } catch (error) {
    throw error;
  }
};


export const Edit = async function (id: number, data: ColumData) {
  let indexs: any = data.index;
  try {
    for (let x in indexs) {
      await Colum.update(
        { index: indexs[x].index },
        { where: { id: indexs[x].id } },
      );
    }

    await Colum.update(
      {
        name: data.name,
        type: data.type,
      },
      { where: { id: id } },
    );
  } catch (err) {
    throw err;
  }
};


export const Delete = async function (id: number) {
  let colum: any = await Colum.findOne({
    where: {
      id: id,
    },
  });

  //dem so luong task trong 1 project
  let last_index: number = await Colum.count({
    where: {
      project_id: colum.project_id,
    },
  });

  //giam gia tri index cua cac cot o cuoi den vi tri cua cot can xoa
  for (let i: number = last_index; i >= colum.index; i--) {
    let col: any = await Colum.findOne({
      where: {
        [Op.and]: [{ index: i }, { project_id: colum.project_id }],
      },
    });

    await col.update({
      index: i - 1,
    });
  }

  await Colum.destroy({
    where: {
      id: id,
    },
  });
};
