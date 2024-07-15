import { Sequelize } from "sequelize"
require('dotenv').config();
const name : any = process.env.DB_NAME
const user : any = process.env.DB_USER
const password : any  = process.env.PASSWORD
export const sequelize = new Sequelize(name, user, password, {
    host: process.env.DB_HOST ,
    dialect: `mysql`,
    port: 3305,
    define: {
        timestamps: false
    }
})

