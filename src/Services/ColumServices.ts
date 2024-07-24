import { Colum } from '../Models/colum';
import { Op } from 'sequelize';
import { ColumData } from '../Interfaces/ColumInterface';
import { sequelize } from '../Config/config';

export const Create = async function (data: ColumData) {
  const t = await sequelize.transaction();

  try {
    await Colum.create(
      {
        type: data.type,
        name: data.name,
        index: data.index,
        project_id: data.project_id,
      },
      { transaction: t },
    );
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

export const Edit = async function (id: number, data: ColumData) {
  const t = await sequelize.transaction();

  let indexs: any = data.index;
  //lay ra cot can sua
  let colum: any = await Colum.findOne({
    where: {
      id: id,
    },
  });
  
  if (data.name == colum.name || !data.name) {
    data.name = colum.name;
  }

  if (!data.type || data.type == colum.type) {
    data.type = colum.type;
  }
  try {
    for (let x in indexs) {
      await Colum.update(
        { index: indexs[x].index },
        { where: { id: indexs[x].id }, transaction: t },
      );
    }

    await Colum.update(
      {
        name: data.name,
        type: data.type,
      },
      { where: { id: id }, transaction: t },
    );
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

export const Delete = async function (id: number) {
  const t = await sequelize.transaction();

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
  try {
    //giam gia tri index cua cac cot o cuoi den vi tri cua cot can xoa
    for (let i: number = last_index; i >= colum.index; i--) {
      let col: any = await Colum.findOne({
        where: {
          [Op.and]: [{ index: i }, { project_id: colum.project_id }],
        },
      });

      await col.update(
        {
          index: i - 1,
        },
        { transaction: t },
      );
    }

    await Colum.destroy({
      where: {
        id: id,
      },
      transaction: t,
    });
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
};
