import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config';
import { System_role } from './system_role';
export const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
System_role.hasMany(User, {
  foreignKey: 'system_role_id',
});
User.belongsTo(System_role, {
  foreignKey: 'system_role_id',
});

