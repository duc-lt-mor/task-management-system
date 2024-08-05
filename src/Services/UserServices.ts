import bcrypt from 'bcrypt';
import { User } from '../Models/user';
import { UserData } from '../Interfaces/UserInterfaces';
import createHttpError from 'http-errors';
import * as tokenService from './TokenService';
import { Login } from '../Models/login';

export const login = async function (data: any) {
  
  const { email, password } = data;
  const user: any = await User.findOne({ where: { email } });
  if (!user) {
    const error = createHttpError(401, `Invalid username or password`);
    throw error;
  }
  const login: any = await Login.findOne({ where: { user_id: user.id } });

  const compare: boolean = await bcrypt.compare(password, user.password);
  if (!compare) {
    await recordAttempt(user.id, false)
    if (login.failed_attempt >= 5) {
      await lock(user)
      throw createHttpError(403, `Account locked due to too many failed login attempts! Please try again later`)
    }
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
    systemRoleID: data.systemRoleID,
  });
  if (user) {
    return user
  } else{ 
    const error = createHttpError(401, `Can't create user`);
    throw error
  }
};

export const find = function (email: string) {
  return User.findOne({ where: { email } });
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

export const recordAttempt = async function(user_id: number, success: boolean) {
  const login: any = await Login.findOne({where: {user_id: user_id}})

  if(success) {
      login.failed_attempt = 0
      login.last_failed_attempt = null
  } else {
      login.failed_attempt += 1
      login.last_failed_attempt = new Date()
  }

  await login.save()
}

export const lock = async function (user: any) {
  user.isLocked = true
  await user.save()
}