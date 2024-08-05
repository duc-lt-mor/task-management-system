import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config';
import { User } from './user';
export const Login = sequelize.define('logins', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  failed_attempt: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  last_failed_attempt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true
});

User.hasMany(Login, {
  foreignKey: 'user_id',
});
Login.belongsTo(User, {
  foreignKey: 'user_id',
});
