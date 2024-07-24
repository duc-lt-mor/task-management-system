import bcrypt from 'bcrypt';
import { User } from '../Models/user';
import { UserData } from './UserInterfaces';

export const register = async function (data: UserData) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      systemRoleID: data.systemRoleID,
    });
    if (user) return { success: true, user };
    else return { success: false };
  } catch (err) {
    throw err;
  }
};

export const getUser = function (name: string) {
  return User.findOne({ where: { name } });
};

export const getUsers = function () {
  return User.findAll();
};

export const deleteUser = function (name: any) {
  return User.destroy({where: {name}})
};

