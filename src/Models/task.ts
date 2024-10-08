import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config';
import { Project } from './project';
import { Column } from './column';
import { User } from './user';
export const Task = sequelize.define(
  'tasks',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expected_end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    real_end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);
Project.hasMany(Task, {
  foreignKey: 'project_id',
});
Task.belongsTo(Project, {
  foreignKey: 'project_id',
});
Column.hasMany(Task, {
  foreignKey: 'column_id',
});
Task.belongsTo(Column, {
  foreignKey: 'column_id',
});
User.hasMany(Task, {
  foreignKey: 'assignee_id',
});
Task.belongsTo(User, {
  foreignKey: 'assignee_id',
});