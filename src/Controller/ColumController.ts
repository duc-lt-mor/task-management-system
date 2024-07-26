import * as ColumServices from '../Services/ColumServices';
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

    await ColumServices.create(req.body);

    res.status(201).send({ message: 'create success' });

  } catch (error) {
    res.status(500).send('create failed');
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

    await ColumServices.edit(Number(req.params.col_id), req.body);

    res.status(200).send('edit success');

  } catch (error) {
    res.status(500).send('edit failed');
  }
};

export const destroy = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((e: any) => e.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    await ColumServices.destroy(Number(req.params.col_id));

    res.status(200).send('delete success');
    
  } catch (error) {
    res.status(500).send('delete failed');
  }
};
