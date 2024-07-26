import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config';
import { User } from './user';
import { Task } from './task';
export const Comment = sequelize.define(
  'comments',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

User.hasMany(Comment, {
  foreignKey: 'user_id',
});
Comment.belongsTo(User, {
  foreignKey: 'user_id',
});
Task.hasMany(Comment, {
  foreignKey: 'task_id',
});
Comment.belongsTo(Task, {
  foreignKey: 'task_id',
});


