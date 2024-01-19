import { NextFunction, Request } from 'express'

export enum ApplicationErrorPrefixes {
    DATABASE_CONNECTION = 'DATABASE CONNECTION',
    CACHE_CONNECTION = 'CACHE CONNECTION',
    MAILER_CONNECTION = 'MAILER CONNECTION',
}

export enum MailerConnectionErrors {
    INVALID_AUTH = 535,
}

export type expressFn = (req: Request, res: Response, next: NextFunction) => unknown

export interface MailerAuthOption {
    smtp: string
    port: number
    user: string
    password: string
}

export interface CustomRoute {
    stack: Stack[]
}

export interface Stack {
    handle: expressFn
    name?: string
}

export interface User {
    email: string
    password: string
    tokens: Token[]
}

export interface CachedUser extends User {
    activationCode: string
}

export interface Token {
    token: string
    lastSignIn: number
    ip: string
    user: User
}
