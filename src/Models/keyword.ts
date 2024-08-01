import { sequelize } from "../Config/config";
import { DataTypes } from "sequelize";
import { Task } from "./task";

export const Keyword = sequelize.define(
    'keywords',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        keyword: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }, task_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Task,
                key: 'id',
            },
        },
    }
)