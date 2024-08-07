import * as ColumnServices from '../Services/ColumnServices';
import express from 'express';

export const create = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    let column: any = await ColumnServices.create(req.body, req);

    res.status(201).send({ message: 'create success', 'new column': column });
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
    let column: any = await ColumnServices.edit(
      Number(req.params.col_id),
      req.body,
      req,
    );

    res.status(200).send({ message: 'edit success', 'edited column': column });
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
    await ColumnServices.destroy(Number(req.params.col_id), req);

    res.status(200).send('delete success');
  } catch (error) {
    next(error);
  }
};
