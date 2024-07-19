import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config';
export const Role = sequelize.define('roles', {
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
sequelize.sync();