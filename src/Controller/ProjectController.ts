import * as ProjectServices from '../Services/ProjectServices';
import express from 'express';

//khoi tao project
export const Create = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    await ProjectServices.Create(req);
    return res.status(201).send({ message: 'create success' });
  } catch (err) {
    return res.status(500).send('create failed');
  }
};

//sua project
export const Edit = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    await ProjectServices.Edit(req);
    return res.status(200).send('update project success');
  } catch (err) {
    return res.status(500).send('update project failed');
  }
};

//xoa project
export const Delete = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    await ProjectServices.Delete(req);
    return res.status(200).send('delete project success');
  } catch (err) {
    return res.status(500).send('delete project failed');
  }
};
