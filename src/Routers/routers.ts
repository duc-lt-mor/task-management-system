import * as user from "../Controller/UserController"
import * as task from "../Controller/TaskController"
import * as comment from "../Controller/CommentControllers"
import * as validator from "../Middleware/UserValidator"
import express from "express"
const router = express.Router()
import * as authenticator from "../Middleware/UserAuthenticator"
import { exceptionHandler } from "../Middleware/ExceptionHandler"

router.get('/login', user.getLogin)
router.post('/register', ...validator.validateRegister(), exceptionHandler, user.postRegister)
router.delete('/user/:userId', user.deleteUser)

router.post('/task', authenticator.authenticateJWT, authenticator.accessControl('create_task'), task.generateTask)
router.get('/task/:id', task.getTask)
router.get('/task', task.getTasks)
router.delete('/task/:key', authenticator.authenticateJWT, authenticator.accessControl('delete_task'), task.deleteTask)
router.put('/task',  authenticator.authenticateJWT, authenticator.accessControl('update_task'), task.update)

router.post('/comment', authenticator.authenticateJWT, authenticator.accessControl('comment'), comment.generate)
router.put('/comment', authenticator.authenticateJWT,  authenticator.accessControl('comment'),comment.update)
router.post('/reply', authenticator.authenticateJWT, authenticator.accessControl('comment'), comment.reply)
router.delete('/comment/:key', authenticator.authenticateJWT, authenticator.accessControl('comment'), comment.destroy)



export { router }