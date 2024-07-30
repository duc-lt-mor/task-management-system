import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config';
export const Project_role = sequelize.define('project_roles', {
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
  project_id: {
    type: DataTypes.INTEGER
  },
  permission_keys: {
    type: DataTypes.JSON,
    allowNull: false
  }
});
