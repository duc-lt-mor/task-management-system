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

export const update = async (req: express.Request, res: express.Response) => {
  try {
    

    const userId = req.params.id; // Assuming the user ID is in the request parameters
    const updates = req.body;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // Update user details
    await user.update(updates);

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', err });
  }
};