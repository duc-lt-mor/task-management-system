import * as ProjectServices from '../Services/ProjectServices';
import express from 'express';
const { body, validationResult } = require('express-validator');

export const create = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((e: any) => e.msg);
      return res.status(400).json({ errors: errorMessages });
    }
    await ProjectServices.create(req.body);
    return res.status(201).send({ message: 'create success' });
  } catch (err) {
    return res.status(500).send('create failed');
  }
};

export const edit = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((e: any) => e.msg);
      return res.status(400).json({ errors: errorMessages });
    }
    await ProjectServices.edit(Number(req.params.project_id), req.body);
    return res.status(200).send('update project success');
  } catch (err) {
    return res.status(500).send('update project failed');
  }
};

export const destroy = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    let project: any = await ProjectServices.findProjectById(
      Number(req.params.project_id),
    );

    if (!project) {
      return res.status(400).send('project already been delete');
    }
    await ProjectServices.destroy(Number(req.params.project_id));
    return res.status(200).send('delete project success');
  } catch (err) {
    return res.status(500).send('delete project failed');
  }
};
