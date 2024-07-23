import { Project } from '../Models/project';
import { Member } from '../Models/member';
import { Colum } from '../Models/colum';
import express from 'express';

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
export const Create = async function (req: express.Request) {
  try {
    let project: any = await Project.create({
      name: req.body.name,
      key: req.body.key,
      decripstion: req.body.decripstion,
      creator_id: req.body.creator_id,
      expected_end_date: req.body.expected_end_date,
    });
    // khoi tao 3 cot mac dinh (todo, inprogress, done)
    await Colum.bulkCreate([
      { col_type: 'todo', name: 'TO DO', col_index: 1, project_id: project.id },
      {
        col_type: 'in_progress',
        name: 'IN PROGRESS',
        col_index: 2,
        project_id: project.id,
      },
      { col_type: 'done', name: 'DONE', col_index: 3, project_id: project.id },
    ]);
  } catch (err) {
    throw new Error('Create failed' + err);
  }
};

// sua project
export const Edit = async function (req: express.Request) {
  try {
    let project: any = await getProjectById(Number(req.params.project_id));
    await project.update({
      name: req.body.name,
      decripstion: req.body.decripstion,
      expected_end_date: req.body.expected_end_date,
    });
  } catch (err) {
    throw new Error('edit failed ' + err);
  }
};
// xoa project
export const Delete = async (req: express.Request) => {
  let project: any = await getProjectById(Number(req.params.project_id));

  await Member.destroy({
    where: {
      project_id: Number(req.params.project_id),
    },
  });

  await Colum.destroy({
    where: {
      project_id: Number(req.params.project_id),
    },
  });

  await Project.destroy({
    where: {
      id: Number(req.params.project_id),
    },
  });
};
