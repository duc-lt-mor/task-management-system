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
  failed_attemp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  last_failed_attemp: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

User.hasMany(Login, {
  foreignKey: 'user_id',
});
Login.belongsTo(User, {
  foreignKey: 'user_id',
});
