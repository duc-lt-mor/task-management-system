import express from 'express';
import { User } from '../Models/user';
import bcrypt from 'bcrypt';
import * as services from '../Services/userServices';

export const getLogin = async (req: express.Request, res: express.Response) => {
  let email = req.body.email;
  let password = req.body.password;
  if (!email) {
    return res.status(400).send(`Please enter your username`);
  }

  if (!password) {
    return res.status(400).send(`Please enter your password`);
  }

  try {
    const user: any = await User.findOne({ where: { email: email } });
    if (!user) {
      res.status(401).send(`Invalid username or password`);
    }

    const compare: boolean = await bcrypt.compare(password, user.password);
    if (!compare) {
      return res.status(401).send('Invalid username or password');
    }
    const token: string = services.generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (err) {
    res.status(500).send(`Internal server error`);
  }
};

export const postRegister = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    await services.register(req, res);
  } catch (err) {
    res.status(500).send(`Internal server error`);
  }
};

export const getUser = async (
  req: express.Request,
  res: express.Response
) => {
  try{
    const name = req.params.name
    const user = await User.findOne({where: {name: name}})
    if (!user) {
      return res.status(404).send(`User not exist`)
    }
    return res.send(200).send(user)
  } catch(err) {
    return res.status(500).send(`Internal server error`)
  }
}

export const getUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await User.findAll()
    res.status(201).send(users)
  } catch (err) {
    res.status(500).send(err)
  }
}

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const name = req.body.name
    const deleted = await User.destroy({where: name})
    if (!name) return res.status(404).send(`User not found`)
    return res.status(201).send(`Deleted successfully`)
  } catch(err) {
    
  }
}