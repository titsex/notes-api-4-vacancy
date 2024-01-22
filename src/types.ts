export enum ApplicationErrorPrefixes {
    DATABASE_CONNECTION = 'DATABASE CONNECTION',
    CACHE_CONNECTION = 'CACHE CONNECTION',
    MAILER_CONNECTION = 'MAILER CONNECTION',
}

export enum MailerConnectionErrors {
    INVALID_AUTH = 535,
}

export interface MailerAuthOption {
    smtp: string
    port: number
    user: string
    password: string
}

export interface User {
    email: string
    password: string
    tokens: Token[]
}

export interface Token {
    token: string
    lastSignIn: number
    ip: string
    user: User
}
