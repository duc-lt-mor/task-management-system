import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import session from 'express-session';
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

export const sessionConfig = {
  secret: 'your_session_secret', // Replace with a strong secret key
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // Set to true if using HTTPS
};
