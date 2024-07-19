import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config';
export const Project = sequelize.define(
  'projects',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    decripstion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    creator_id: {
      type: DataTypes.INTEGER,
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
