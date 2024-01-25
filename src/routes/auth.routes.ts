import AuthValidation from '@validation/auth.validation'
import AuthController from '@controller/auth.controller'
import container from '@container'

import { CONTAINER_NAMES } from '@consts'
import { Router } from 'express'

const authRouter = Router()
const authController = container.get<AuthController>(CONTAINER_NAMES.AUTH_CONTROLLER)

authRouter.post('/registration', AuthValidation.registration, authController.registration)
authRouter.post('/activation/:email/:code', AuthValidation.activation, authController.activation)
authRouter.post('/login', AuthValidation.login, authController.login)
authRouter.post('/refresh', authController.refresh)
authRouter.post('/logout', authController.logout)

export default authRouter
