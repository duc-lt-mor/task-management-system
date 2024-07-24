import * as ColumServices from '../Services/ColumServices';
import express from 'express';

export const Create = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    await ColumServices.Create(req.body);
    res.status(201).send({ message: 'create success' });
  } catch (error) {
    res.status(500).send('create failed');
  }
};

export const Edit = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    await ColumServices.Edit(Number(req.params.col_id), req.body);
    res.status(200).send("edit success");
  } catch (error) {
    res.status(500).send('edit failed');
  }
};

export const Delete = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    await ColumServices.Delete(Number(req.params.col_id));
    res.status(200).send("delete success");
  } catch (error) {
    res.status(500).send('delete failed');
  }
};
