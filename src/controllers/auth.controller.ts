import AuthService from '@service/auth.service'

import { ActivationDto, LoginDto, RegistrationDto } from '@dto/auth.dto'
import { inject, injectable } from 'inversify'
import { Request, Response } from 'express'
import { CONTAINER_NAMES } from '@consts'
import { getIp } from '@utils'

@injectable()
class AuthController {
    @inject(CONTAINER_NAMES.AUTH_SERVICE) private authService!: AuthService

    public registration = async (request: Request, response: Response) => {
        const dto = request.body as RegistrationDto

        const result = await this.authService.registration(dto)

        return response.json(result)
    }

    public activation = async (request: Request, response: Response) => {
        // I know that I can specify generic for Request to get a typed query field, but I don't like the entry:
        //  Request<ActivationDto, any, any, QueryString.ParsedQs, Record<string, any>>
        const dto = request.params as unknown as ActivationDto

        const result = await this.authService.activate({ ...dto, ip: getIp(request) })

        response.cookie('refreshToken', result.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

        return response.json(result)
    }

    public login = async (request: Request, response: Response) => {
        const dto = request.body as LoginDto

        const result = await this.authService.login({ ...dto, ip: getIp(request) })

        response.cookie('refreshToken', result.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

        return response.json(result)
    }

    public logout = async (request: Request, response: Response) => {
        const refreshToken = request.cookies['refreshToken']

        const result = await this.authService.logout(refreshToken)

        response.clearCookie('refreshToken')

        return response.json(result)
    }

    public refresh = async (request: Request, response: Response) => {
        const refreshToken = request.cookies['refreshToken']

        const result = await this.authService.refresh({ refreshToken, ip: getIp(request) })

        response.cookie('refreshToken', result.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

        return response.json(result)
    }
}

export default AuthController
