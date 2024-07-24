import { User } from '../Models/user';
import * as MemberServices from '../Services/MemberServices';
import express from 'express';
import { Op } from 'sequelize';


export const Add = async function (
  req: express.Request,
  res: express.Response,
) {
  let find_mem: string = req.body.find_mem;

  let user: any = await User.findOne({
    where: {
      [Op.or]: [{ name: find_mem }, { email: find_mem }],
    },
  });
  try {
    await MemberServices.Add(user.id, req.body);
    return res.status(200).send('add member success');
  } catch (err) {
    return res.status(500).send('add member failed');
  }
};


export const Remove = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    await MemberServices.Remove(Number(req.params.id));
    return res.status(200).send('delete member success');
  } catch (error) {
    return res.status(500).send('add member failed');
  }
};


export const EditRole = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    await MemberServices.EditRole(Number(req.params.id), req.body);
    res.status(201).send('edit member role success');
  } catch (error) {
    res.status(500).send('change role failed');
  }
};


export const Show = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    let members = await MemberServices.Show(req.body);
    res.status(200).send(members);
  } catch (error) {
    res.status(500).send("can't get member list");
  }
};
