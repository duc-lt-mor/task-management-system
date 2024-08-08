import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config';
export const Project_role = sequelize.define('project_roles', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  is_pm: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  project_id: {
    type: DataTypes.INTEGER,
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

