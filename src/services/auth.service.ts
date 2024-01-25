import TokenService from '@service/token.service'
import UserPayload from '@class/UserPayload'
import TokenModel from '@model/token.model'
import UserModel from '@model/user.model'
import Mailer from '@class/Mailer'
import Redis from '@class/Redis'

import { ActivationDto, LoginDto, RefreshDto, RegistrationDto } from '@dto/auth.dto'
import { BadRequestError, UnauthorizeError } from '@class/Error'
import { inject, injectable } from 'inversify'
import { generateUniqueHex } from '@utils'
import { CONTAINER_NAMES } from '@consts'
import { compare, hash } from 'bcrypt'
import { User } from '@types'

@injectable()
class AuthService {
    @inject(CONTAINER_NAMES.TOKEN_SERVICE) private tokenService!: TokenService

    public registration = async (data: RegistrationDto) => {
        const cachedData = await Redis.get(data.email)

        if (cachedData)
            throw new BadRequestError('This mail is already at the last stage of registration, awaiting confirmation')

        const candidate = await UserModel.findOne({ email: data.email })
        if (candidate) throw new BadRequestError('A user with such an email is already registered')

        const hashedPassword = await hash(data.password, 7)

        const newUser = {
            ...data,
            password: hashedPassword,
        }

        const code = await generateUniqueHex()

        await Mailer.send(data.email, 'Account Activation', code)
        await Redis.set(data.email, JSON.stringify({ ...newUser, code }))

        return { message: 'To confirm your identity, we have sent you an email link to activate your account' }
    }

    public activate = async (data: ActivationDto) => {
        const cachedData = await Redis.get(data.email)
        if (!cachedData) throw new BadRequestError('The email is incorrect or the time has expired')

        await Redis.delete(data.email)

        const { code, ...user } = JSON.parse(cachedData) as User & { code: string }

        if (data.code !== code) throw new BadRequestError('Invalid activation link')

        const newUser = new UserModel(user)
        await newUser.save()

        const userPayload = new UserPayload(newUser)
        const tokens = this.tokenService.generateTokens(userPayload)

        await this.tokenService.saveRefreshToken(newUser.id, tokens.refreshToken, data.ip)
        return { ...tokens, user: userPayload }
    }

    public login = async (data: LoginDto) => {
        const candidate = await UserModel.findOne({ email: data.email })
        if (!candidate) throw new BadRequestError('The user with this email address has not been found')

        const comparePassword = await compare(data.password, candidate.password)
        if (!comparePassword) throw new BadRequestError('Invalid password')

        const userPayload = new UserPayload(candidate)
        const tokens = this.tokenService.generateTokens(userPayload)

        await this.tokenService.saveRefreshToken(candidate.id, tokens.refreshToken, data.ip)
        return { ...tokens, user: userPayload }
    }

    public logout = async (refreshToken?: string) => {
        if (!refreshToken) throw new UnauthorizeError()

        const candidate = await TokenModel.findOne({ token: refreshToken })
        if (!candidate) throw new UnauthorizeError()

        await TokenModel.deleteOne({ token: refreshToken })

        return { message: 'You have successfully logged out' }
    }

    public refresh = async (data: RefreshDto) => {
        if (!data.refreshToken) throw new UnauthorizeError()

        const userPayloadFromToken = this.tokenService.validateRefreshToken(data.refreshToken) as UserPayload
        const tokenInfoFromDb = await TokenModel.findOne({ token: data.refreshToken })

        if (!userPayloadFromToken || !tokenInfoFromDb) throw new UnauthorizeError()

        const user = await UserModel.findOne({ email: userPayloadFromToken.email })
        if (!user) throw new BadRequestError('The user with this email address has not been found')

        const userPayload = new UserPayload(user)
        const tokens = this.tokenService.generateTokens(userPayload)

        await this.tokenService.saveRefreshToken(user.id, tokens.refreshToken, data.ip)
        return { ...tokens, user: userPayload }
    }
}

export default AuthService
