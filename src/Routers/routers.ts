import * as user from "../Controller/UserController"
import * as validator from "../Middleware/UserValidator"
import express from "express"
const router = express.Router()
import * as authenticator from "../Middleware/UserAuthenticator"
import { exceptionHandler } from "../Middleware/ExceptionHandler"

router.get('/login', user.login)
router.post('/register', ...validator.validateRegister(), user.register)
router.delete('/user/:userId', user.deleteUser)

export { router }