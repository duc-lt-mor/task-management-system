import { Member } from '../Models/member';
import { User } from '../Models/user';
import * as MemberServices from '../Services/MemberServices';
import express from 'express';

//them thanh vien
export const Add = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    await MemberServices.Add(req);
    return res.status(200).send('add member success');
  } catch (err) {
    return res.status(500).send('add member failed');
  }
};

//xoa member khoi project
export const Remove = async function (
  req: express.Request,
  res: express.Response,
) {
  try {
    await MemberServices.Remove(req);
    return res.status(200).send('delete member success');
  } catch (error) {
    return res.status(500).send('add member failed');
  }
};

//thay doi role cua member trong project
export const EditRole = async function (
  req: express.Request,
  res: express.Response,
) {
  let project_id: number = Number(req.params.projectid);
  let user_id: number = Number(req.body.user_id);
  let role_id: number = Number(req.body.role_id);
  let member: any = await Member.findOne({
    where: {
      user_id: user_id,
      project_id: project_id,
    },
  });
  if (!member) {
    //kiem tra xem member co trong project hay khong
    res.status(404).send('user already has been remove');
  } else {
    await MemberServices.EditRole(req);
    res.status(201).send('edit member role success');
  }
};

//xem danh sach thanh vien
export const Show = async function (
  req: express.Request,
  res: express.Response,
) {
  let project_id: number = Number(req.params.projectid);
  let members: any = await Member.findAll({
    where: {
      project_id: project_id,
    },
    attributes: {
      exclude: ['id'],
    },
    include: [
      {
        model: User,
      },
    ],
  });
  res.status(200).send(members);
};
