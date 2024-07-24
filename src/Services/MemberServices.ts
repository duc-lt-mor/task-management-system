import { Member } from '../Models/member';
import { User } from '../Models/user';
import { MemberData } from '../Interfaces/MemberInterface';

//them thanh vien vao project
export const Add = async function (id: number, data: MemberData) {
  try {
    await Member.create({
      user_id: id,
      project_id: data.project_id,
      role_id: data.role_id,
    });
  } catch (err) {
    throw new Error('remove failed ' + err);
  }
};

//xoa thanh vien khoi project
export const Remove = async function (id: number) {
  try {
    await Member.destroy({
      where: { id: id },
    });
  } catch (err) {
    throw new Error('remove failed ' + err);
  }
};

//cap nhat role cua thanh vien trong project
export const EditRole = async function (id: number, data: MemberData) {
  try {
    await Member.update(
      { role_id: Number(data.role_id) },
      { where: { id: id } },
    );
  } catch (error) {
    throw new Error('update failed ' + error);
  }
};

//xem danh sach thanh vien cua project
export const Show = async function (data: MemberData) {
  try {
    let project_id: number = Number(data.project_id);
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

    return members;
  } catch (error) {
    throw new Error('update failed ' + error);
  }
};
