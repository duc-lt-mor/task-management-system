import * as user from "../Controller/UserController"
import * as task from "../Controller/TaskController"
import * as validator from "../Middleware/UserValidator"
import express from "express"
const router = express.Router()
import * as authenticator from "../Middleware/UserAuthenticator"
import { exceptionHandler } from "../Middleware/ExceptionHandler"

router.get('/login', user.getLogin)
router.post('/register', ...validator.validateRegister(), user.postRegister)
router.delete('/user/:userId', user.deleteUser)

router.post('/task', authenticator.authenticateJWT, authenticator.accessControl('create_task'), task.generateTask)
router.get('/task/:id', task.getTask)
router.get('/task', task.getTasks)
router.delete('/task/:id', task.deleteTask)

router.put('/task', task.update)

export { router }