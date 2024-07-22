import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config';
export const System_role = sequelize.define('system_roles', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  decripstion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
