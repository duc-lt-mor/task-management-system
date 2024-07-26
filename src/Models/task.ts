import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config';
import { Project } from './project';
import { Colum } from './colum';
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    decription: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    piority: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expected_end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    real_end_date: {
      type: DataTypes.DATE,
      allowNull: false,
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
Colum.hasMany(Task, {
  foreignKey: 'colum_id',
});
Task.belongsTo(Colum, {
  foreignKey: 'colum_id',
});
User.hasMany(Task, {
  foreignKey: 'assignee_id',
});
Task.belongsTo(User, {
  foreignKey: 'assignee_id',
});

