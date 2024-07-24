import * as ProjectServices from '../Services/ProjectServices';
import express from 'express';


export const Create = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    await ProjectServices.Create(req.body);
    return res.status(201).send({ message: 'create success' });
  } catch (err) {
    return res.status(500).send('create failed');
  }
};


export const Edit = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    await ProjectServices.Edit(Number(req.params.project_id), req.body);
    return res.status(200).send('update project success');
  } catch (err) {
    return res.status(500).send('update project failed');
  }
};


export const Delete = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    await ProjectServices.Delete(Number(req.params.project_id));
    return res.status(200).send('delete project success');
  } catch (err) {
    return res.status(500).send('delete project failed');
  }
};
