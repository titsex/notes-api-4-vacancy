import TokenService from '@service/token.service'
import UserPayload from '@class/UserPayload'
import UserModel from '@model/user.model'
import Mailer from '@class/Mailer'
import Cache from '@class/Cache'

import { ActivationDto, RegistrationDto } from '@dto/auth.dto'
import { BadRequestError } from '@class/Error'
import { inject, injectable } from 'inversify'
import { generateUniqueHex } from '@utils'
import { CONTAINER_NAMES } from '@consts'
import { CachedUser } from '@types'
import { hash } from 'bcrypt'

@injectable()
class AuthService {
    @inject(CONTAINER_NAMES.TOKEN_SERVICE) private tokenService!: TokenService

    public registration = async (data: RegistrationDto) => {
        const cachedData = await Cache.getCache(data.email)

        if (cachedData)
            throw new BadRequestError('This mail is already at the last stage of registration, awaiting confirmation')

        const candidate = await UserModel.findOne({ email: data.email })
        if (candidate) throw new BadRequestError('A user with such an email is already registered')

        const hashedPassword = await hash(data.password, 7)

        const newUser = {
            ...data,
            password: hashedPassword,
        }

        const activationCode = await generateUniqueHex()

        await Mailer.sendMail(data.email, 'Account Activation', activationCode)
        await Cache.setCache(data.email, JSON.stringify({ ...newUser, activationCode }))

        return { message: 'To confirm your identity, we have sent you an email link to activate your account' }
    }

    public activate = async (data: ActivationDto) => {
        const cachedData = await Cache.getCache(data.email)
        if (!cachedData) throw new BadRequestError('The email is incorrect or the time has expired')

        await Cache.deleteCache(data.email)

        const { activationCode, ...user } = JSON.parse(cachedData) as CachedUser

        if (data.activationCode !== activationCode) throw new BadRequestError('Invalid activation link')

        const newUser = new UserModel(user)
        await newUser.save()

        const userPayload = new UserPayload(newUser)
        const tokens = this.tokenService.generateTokens(userPayload)

        await this.tokenService.saveRefreshToken(newUser.id, tokens.refreshToken, data.ip)
        return { ...tokens, user: userPayload }
    }
}

export default AuthService
