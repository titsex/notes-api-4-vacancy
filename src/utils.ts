import { randomBytes } from 'crypto'
import { Request } from 'express'

export const getIp = (request: Request) =>
    request.headers['x-forwarded-for']?.toString() || request.socket.remoteAddress!.toString()

export const randomString = (length: number) => randomBytes(length).toString('hex')

export const randomNumber = (minimum: number, maximum: number) =>
    Math.floor(Math.random() * (maximum - minimum + 1) + minimum)

export const generateUniqueHex = async (): Promise<string> => randomString(randomNumber(10, 20))
