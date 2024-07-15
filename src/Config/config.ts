import { Sequelize } from "sequelize"

const name = 'task_management_system'
const user = `user`
const password = `root`

export const sequelize = new Sequelize(name, user, password, {
    host: `127.0.0.1`,
    dialect: `mysql`,
    port: 3305,
    define: {
        timestamps: false
    }
})

