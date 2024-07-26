import bcrypt from 'bcrypt';
import { User } from '../Models/user';
import { UserData } from '../Interfaces/UserInterfaces';
import createHttpError from 'http-errors';
import * as tokenService from './TokenService';

export const login = async function (data: any) {
  const { email, password } = data;
  const user: any = await User.findOne({ where: { email } });
  if (!user) {
    const error = createHttpError(401, `Invalid username or password`);
    throw error;
  }

  const compare: boolean = await bcrypt.compare(password, user.password);
  if (!compare) {
    const error = createHttpError(401, `Invalid username or password`);
    throw error;
  }
  const token: string = tokenService.generateToken({
    id: user.id,
    email: user.email,
    system_role_id: user.system_role_id,
  });

  return token;
};

export const register = async function (data: UserData) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    phone_number: data.phone_number,
    system_role_id: data.system_role_id,
  });
  if (user) {
    return user
  } else{ 
    const error = createHttpError(401, `Can't create user`);
    throw error
  }
};

export const find = function (email: string) {
  return User.findOne({ where: { email: email } });
};

export const get = function () {
  return User.findAll();
};

export const setPhone = async function (email: string, phone: number) {
  const user: any = await find(email);

  if (!user) {
    const error = createHttpError(404, `User not found`);
    throw error
  }

  Object.assign(user, phone);
  await user.save();
  return user;
};

export const deleteUser = function (id: number) {
  return User.destroy({ where: { id } });
};
