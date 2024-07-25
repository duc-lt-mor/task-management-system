import { Member } from '../Models/member';
import { User } from '../Models/user';
import { MemberData } from '../Interfaces/MemberInterface';
import { sequelize } from '../Config/config';

//them thanh vien vao project
export const add = async function (id: number, data: MemberData) {
  const t = await sequelize.transaction();

  try {
    await Member.create(
      {
        user_id: id,
        project_id: data.project_id,
        role_id: data.role_id,
      },
      { transaction: t },
    );
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

//xoa thanh vien khoi project
export const remove = async function (id: number) {
  const t = await sequelize.transaction();

  try {
    await Member.destroy({
      where: { id: id },
      transaction: t,
    });
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

//cap nhat role cua thanh vien trong project
export const editRole = async function (id: number, data: MemberData) {
  const t = await sequelize.transaction();

  try {
    await Member.update(
      { role_id: Number(data.role_id) },
      { where: { id: id }, transaction: t },
    );
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

//xem danh sach thanh vien cua project
export const show = async function (data: MemberData) {
  let project_id: number = Number(data.project_id);
  let members = await Member.findAll({
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

  return members;
};
