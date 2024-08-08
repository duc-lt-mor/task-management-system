import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config';
import { Project } from '../Models/project';
export const Column = sequelize.define('columns', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  col_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  col_index: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});
Project.hasMany(Column, {
  foreignKey: 'project_id',
});
Column.belongsTo(Project, {
  foreignKey: 'project_id',
});
