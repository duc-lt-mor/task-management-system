import * as user from "../Controller/UserController"
import * as task from "../Controller/TaskController"
import { validator } from "../Middleware/UserValidator"
import express from "express"
const router = express.Router()
import * as authenticator from "../Middleware/UserAuthenticator"

router.get('/login', user.getLogin)
router.post('/register', ...validator(), user.postRegister)
router.delete('/', user.deleteUser)

router.post('/api/task', authenticator.authenticateJWT, task.generateTask)
router.get('/task/:id', task.getTask)
router.get('/task', task.getTasks)
router.delete('/task/:id', task.deleteTask)

router.put('/task', task.update)

export { router }