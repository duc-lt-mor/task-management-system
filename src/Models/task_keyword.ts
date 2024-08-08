import { sequelize } from '../Config/config';
import { DataTypes } from 'sequelize';
import { Task } from './task';
import { Keyword } from './keyword';

export const TaskKeyword = sequelize.define(
  'TaskKeywords',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Task,
        key: 'id',
      },
    },
    keyword_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Keyword,
        key: 'id',
      },
    },
  },
  {
    timestamps: false,
  },
);

Task.hasMany(TaskKeyword, {
  foreignKey: 'task_id',
});
TaskKeyword.belongsTo(Task, {
  foreignKey: 'task_id',
});
Keyword.hasMany(TaskKeyword, {
  foreignKey: 'keyword_id',
});
TaskKeyword.belongsTo(Keyword, {
  foreignKey: 'keyword_id',
});

