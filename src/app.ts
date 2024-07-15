import express, { Request, Response} from "express"
import {sequelize} from "./Config/config"
require('dotenv').config();
const app = express()
const port = process.env.PORT

app.get(`/`, (req: Request, res: Response) => {
    res.send(`Express + TypeScript server`)
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})