import { sequelize } from "../Config/config";
import { DataTypes } from "sequelize";
import { Task } from "./task";
import { Keyword } from "./keyword";

export const TaskKeyword = sequelize.define(
    'TaskKeywords',
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        task_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Task,
                key: 'id'
            }
        },
        keyword_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Keyword,
                key: 'id'
            }            
        }
    }, {
        timestamps: false
    }
)

sequelize.sync()