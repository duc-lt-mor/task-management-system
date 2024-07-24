import bcrypt from 'bcrypt';
import { User } from '../Models/user';
import { UserData } from './UserInterfaces';

export const register = async function (data: UserData) {
  try {
    const existedUser = await User.findOne({
      where: { email: data.email },
    });
    if (existedUser) {
      return { success: false, error: `Email is already taken, please try another one` };
    }
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone_number: data.phone_number,
      system_role_id: data.system_role_id
    })
    return user
  } catch (err) {
    throw err
  }
};

export const getUser = async function (name: string) {
  const user = await User.findOne({ where: { name } });
  return user;
};

export const getUsers = function () {
  return User.findAll();
};

export const deleteUser = function (name: string) {
  return User.destroy({ where: { name } });
};
