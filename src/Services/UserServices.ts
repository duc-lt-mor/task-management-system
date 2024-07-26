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

export const find = function (email: string) {
  return User.findOne({ where: { email } });
};

export const get = function () {
  return User.findAll();
};

export const setPhone = async function (email: string, phone: number) {
  const user: any = await find(email);

  if (!user) {
    return { success: false };
  }

  Object.assign(user, phone);
  await user.save();
  return user;
};

export const deleteUser = function (id: number) {
  return User.destroy({ where: { id } });
};
