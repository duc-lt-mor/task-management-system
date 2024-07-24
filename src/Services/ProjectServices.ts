import { Project } from '../Models/project';
import { Member } from '../Models/member';
import { Colum } from '../Models/colum';
import { ProjectData } from '../Interfaces/ProjectInterface';
import { sequelize } from '../Config/config';

// lay ra 1 project
export const getProjectById = async (id: number) => {
  let project = await Project.findOne({
    where: {
      id: id,
    },
  });
  return project;
};

// tao 1 project
export const Create = async function (data: ProjectData) {
  const t = await sequelize.transaction();

  try {
    let project: any = await Project.create(
      {
        name: data.name,
        key: data.key,
        decripstion: data.decriptstion,
        creator_id: data.creator_id,
        expected_end_date: data.expected_end_date,
      },
      { transaction: t },
    );
    // khoi tao 3 cot mac dinh (todo, inprogress, done)
    await Colum.bulkCreate(
      [
        {
          type: 'todo',
          name: 'TO DO',
          index: 1,
          project_id: project.id,
        },
        {
          type: 'in_progress',
          name: 'IN PROGRESS',
          index: 2,
          project_id: project.id,
        },
        {
          type: 'done',
          name: 'DONE',
          index: 3,
          project_id: project.id,
        },
      ],
      { transaction: t },
    );

    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

// sua project
export const Edit = async function (id: number, data: ProjectData) {
  const t = await sequelize.transaction();

  try {
    let project: any = await getProjectById(id);
    await project.update(
      {
        name: data.name,
        decripstion: data.decriptstion,
        expected_end_date: data.expected_end_date,
      },
      { transaction: t },
    );

    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
};
// xoa project
export const Delete = async (id: number) => {
  const t = await sequelize.transaction();

  try {
    await Member.destroy({
      where: {
        project_id: id,
      },
      transaction: t,
    });

    await Colum.destroy({
      where: {
        project_id: id,
      },
      transaction: t,
    });

    await Project.destroy({
      where: {
        id: id,
      },
      transaction: t,
    });

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};
