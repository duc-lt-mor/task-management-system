import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config';
import { Project } from '../Models/project';
export const Colum = sequelize.define('colums', {
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
Project.hasMany(Colum, {
  foreignKey: 'project_id',
});
Colum.belongsTo(Project, {
  foreignKey: 'project_id',
});

