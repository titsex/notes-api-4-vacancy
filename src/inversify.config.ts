import AuthController from '@controller/auth.controller'
import AuthService from '@service/auth.service'

import TokenService from '@service/token.service'

import { CONTAINER_NAMES } from '@consts'
import { Container } from 'inversify'

const container = new Container()

container.bind<AuthController>(CONTAINER_NAMES.AUTH_CONTROLLER).to(AuthController)
container.bind<AuthService>(CONTAINER_NAMES.AUTH_SERVICE).to(AuthService)

container.bind<TokenService>(CONTAINER_NAMES.TOKEN_SERVICE).to(TokenService)

export default container
