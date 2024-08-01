import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config';
import { Project_role } from './project_role';
import { User } from './user';
import { Project } from './project';
export const Member = sequelize.define('members', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
});
Project_role.hasMany(Member, {
  foreignKey: 'project_role_id',
});
Member.belongsTo(Project_role, {
  foreignKey: 'project_role_id',
});
User.hasMany(Member, {
  foreignKey: 'user_id',
});
Member.belongsTo(User, {
  foreignKey: 'user_id',
});
Project.hasMany(Member, {
  foreignKey: 'project_id',
});
Member.belongsTo(Project, {
  foreignKey: 'project_id',
});
