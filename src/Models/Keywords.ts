import { DataTypes } from "sequelize";
import { sequelize } from "../Config/config";

export const Keywords = sequelize.define(
    'keywords', 
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false
        }, 
        keyword: {
            type: DataTypes.STRING,
            allowNull: false
        }
})