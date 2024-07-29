import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config';
import { Role } from './role';
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
Role.hasMany(Member, {
  foreignKey: 'role_id',
});
Member.belongsTo(Role, {
  foreignKey: 'role_id',
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
