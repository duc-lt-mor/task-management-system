import express, { Request, Response} from "express"
import {sequelize} from "./Config/config"
const app = express()
const port = 3000

app.get(`/`, (req: Request, res: Response) => {
    res.send(`Express + TypeScript server`)
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})