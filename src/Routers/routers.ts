import express from "express"
import * as user from "../Controller/UserController"
import * as task from "../Controller/TaskController"
import * as authenticator from "../Middleware/UserAuthenticator"
import { validateTask }   from "../Middleware/TaskValidator"
import * as userValidator from "../Middleware/UserValidator"

const router = express.Router()

router.get('/login', user.getLogin)
router.post('/register', ...userValidator.validateRegister(), user.postRegister)
router.delete('/user/:userId', user.deleteUser)

router.post('/task', authenticator.authenticateJWT, authenticator.accessControl('create_task'), validateTask, task.generateTask)
router.get('/task/:id', authenticator.authenticateJWT, authenticator.accessControl('get_task'), task.getTask)
router.get('/task', authenticator.authenticateJWT, authenticator.accessControl('get_tasks'), task.getTasks)
router.delete('/task/:id', authenticator.authenticateJWT, authenticator.accessControl('delete_task'), task.deleteTask)
router.put('/task', authenticator.authenticateJWT, authenticator.accessControl('update_task'), task.update)

export { router }