import { Colum } from '../Models/colum';
import { Op } from 'sequelize';
import { ColumData } from '../Interfaces/ColumInterface';
import { sequelize } from '../Config/config';

export const create = async function (data: ColumData) {
  const t = await sequelize.transaction();

  let cols: number = await Colum.count({
    where: {
      project_id: data.project_id
    }
  })

  try {
    await Colum.create(
      {
        type: data.type,
        name: data.name,
        index: cols +1,
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

export const edit = async function (id: number, data: ColumData) {
  const t = await sequelize.transaction();

  let indexs = data.array_index;
  //lay ra cot can sua
  let colum: any = await Colum.findOne({
    where: {
      id: id,
    },
  });

  if (!data.name) {
    data.name = colum.name;
  }

  if (!data.type) {
    data.type = colum.type;
  }
  try {
    await Promise.all([
      await Promise.all(indexs.map(async (inde) =>
        Colum.update({ index: inde.index }, { where: { id: inde.id } }),
      )),

      await Colum.update(
        {
          name: data.name,
          type: data.type,
        },
        { where: { id: id }, transaction: t },
      ),
    ]);

    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

export const destroy = async function (id: number) {
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
