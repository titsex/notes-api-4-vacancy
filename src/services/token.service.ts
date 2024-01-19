import UserPayload from '@class/UserPayload'
import TokenModel from '@model/token.model'

import { decode, JwtPayload, sign, verify } from 'jsonwebtoken'
import { injectable } from 'inversify'
import { Types } from 'mongoose'

@injectable()
class TokenService {
    public generateTokens = (payload: UserPayload) => {
        // It looks strange, but it solves the problem with the error: "Expected "payload" to be a plain object."
        payload = { ...payload }

        const accessToken = sign(payload, process.env.JWT_ACCESS_KEY!, { expiresIn: '30m' })
        const refreshToken = sign(payload, process.env.JWT_REFRESH_KEY!, { expiresIn: '30d' })

        return { accessToken, refreshToken }
    }

    public validateRefreshToken = (token: string) => {
        try {
            return verify(token, process.env.JWT_REFRESH_KEY!)
        } catch {
            return null
        }
    }

    public validateAccessToken = (token: string) => {
        try {
            return verify(token, process.env.JWT_REFRESH_KEY!)
        } catch {
            return null
        }
    }

    public saveRefreshToken = async (userObjectId: Types.ObjectId, token: string, ip: string) => {
        const userRefreshTokens = await TokenModel.find({ user: userObjectId })

        if (userRefreshTokens.length) {
            for (let i = 0; i < userRefreshTokens.length; i++) {
                const tokenInfo = decode(userRefreshTokens[i].token) as JwtPayload

                if (Date.now() < tokenInfo.exp!) await TokenModel.deleteOne({ id: userRefreshTokens[i].id })

                if (userRefreshTokens[i].ip === ip) {
                    const userRefreshToken = await TokenModel.findOne({ id: userRefreshTokens[i].id })

                    userRefreshToken!.token = token
                    userRefreshToken!.lastSignIn = Date.now()

                    return await userRefreshToken!.save()
                }
            }
        }

        const newUserRefreshToken = new TokenModel({
            user: userObjectId,
            ip,
            refreshToken: token,
            lastSignIn: Date.now(),
        })

        return await newUserRefreshToken.save()
    }
}

export default TokenService
