import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

config();
const name: any = process.env.DB_NAME;
const user: any = process.env.DB_USER;
const password: any = process.env.PASSWORD;
const db_port: any = process.env.DB_PORT;
export const sequelize = new Sequelize(name, user, password, {
  host: process.env.DB_HOST,
  dialect: `mysql`,
  port: db_port,
  define: {
    timestamps: false,
  },
});
