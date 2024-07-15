import { Sequelize } from "sequelize"
import * as dotenv from "dotenv"
dotenv.config({path: __dirname+`.env`})
const name : any = process.env.DB_NAME
const user : any = process.env.USER
const password : any  = process.env.PASSWORD

export const sequelize = new Sequelize(name, user, password, {
    host: process.env.HOST ,
    dialect: `mysql`,
    port: 3305,
    define: {
        timestamps: false
    }
})

