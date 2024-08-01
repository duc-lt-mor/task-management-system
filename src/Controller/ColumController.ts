import * as ColumServices from '../Services/ColumServices';
import express from 'express';

export const create = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    let comlum: any = await ColumServices.create(req.body, req);

    res.status(201).send({ message: 'create success', 'new colum': comlum });
  } catch (error) {
    next(error);
  }
};

export const edit = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    let colum: any = await ColumServices.edit(
      Number(req.params.col_id),
      req.body,
      req,
    );

    res.status(201).send({ message: 'edit success', 'edited colum': colum });
  } catch (error) {
    next(error);
  }
};

export const destroy = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    await ColumServices.destroy(Number(req.params.col_id), req);

    res.status(200).send('delete success');
  } catch (error) {
    next(error);
  }
};
