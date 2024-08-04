import { sequelize } from "../Config/config";
import { DataTypes } from "sequelize";

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
        }
    }
)