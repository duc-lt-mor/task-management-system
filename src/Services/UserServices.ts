import express from 'express';
import { User } from '../Models/user';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

export interface UserPayload {
  name: string;
  email: string;
  role: number;
}

export const register = async (req: express.Request, res: express.Response) => {
  let password = req.body.password;
  let passwordConfirm = req.body.passwordConfirm;
  let name = req.body.name;
  let email = req.body.email;
  let phone_number = req.body.phone_number;
  let system_role_id = req.body.system_role_id;
  if (!name) {
    throw new Error('Please enter your name');
  }
  if (!password) {
    throw new Error('Please enter your password');
  }
  if (!name) {
    throw new Error('Please enter your name');
  }
  if (!email) {
    throw new Error('Please enter your email');
  }
  if (!passwordConfirm) {
    throw new Error('Please enter your confirmation password');
  }
  if (passwordConfirm !== password) {
    throw new Error('Password and confirmation password must match');
  }
  if (!phone_number) {
    throw new Error('Please fill in the right number format');
  }

  const existing = await User.findOne({
    where: {
      [Op.or]: [{ name }, { email }],
    },
  });
  if (existing) {
    return res.status(409).send(`Username/Email already taken.`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    name,
    password: hashedPassword,
    system_role_id,
    email,
    phone_number,
  });
};

export const getUser =  function (req: express.Request) {
  const name = req.params.name;
  return User.findOne({ where: { name: name } });
};

export const getUsers = function () {
  return User.findAll();
};

export const deleteUser = function (req: express.Request) {
  const name = req.body.name;
  return User.destroy({ where: name });
};
