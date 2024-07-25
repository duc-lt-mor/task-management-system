import * as user from "../Controller/UserController"
import * as task from "../Controller/TaskController"
import { validator } from "../Middleware/UserValidator"
import express from "express"
const router = express.Router()
import * as authenticator from "../Middleware/UserAuthenticator"

router.get('/login', user.getLogin)
router.post('/register', ...validator(), user.postRegister)
router.delete('/', user.deleteUser)

router.get('/task/:id', authenticator.verifyToken, task.getTask)
router.get('/task', authenticator.verifyToken, task.getTasks)
router.delete('/task/:id', authenticator.verifyToken, authenticator.authorizeRole([1]), task.deleteTask)

router.put('/task', authenticator.verifyToken, authenticator.authorizeRole([1, 2, 3]), task.updateTaskInfo)
router.put('/status', authenticator.verifyToken, task.updateStatus)

export { router }