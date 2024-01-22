import AuthService from '@service/auth.service'

import { inject, injectable } from 'inversify'
import { Request, Response } from 'express'
import { CONTAINER_NAMES } from '@consts'
import { getIp } from '@utils'

@injectable()
class AuthController {
    @inject(CONTAINER_NAMES.AUTH_SERVICE) private authService!: AuthService

    public registration = async (request: Request, response: Response) => {
        const { email, password } = request.body

        const result = await this.authService.registration({ email, password })

        return response.json(result)
    }

    public activation = async (request: Request, response: Response) => {
        const { email, code } = request.query as Record<string, string>

        const result = await this.authService.activate({ activationCode: code, email, ip: getIp(request) })

        return response.json(result)
    }
}

export default AuthController
