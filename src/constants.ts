import { MailerAuthOption } from '@types'

export const CONTAINER_NAMES = {
    AUTH_CONTROLLER: Symbol.for('AUTH_CONTROLLER'),
    AUTH_VALIDATION: Symbol.for('AUTH_VALIDATION'),
    AUTH_SERVICE: Symbol.for('AUTH_SERVICE'),
    TOKEN_CONTROLLER: Symbol.for('TOKEN_CONTROLLER'),
    TOKEN_SERVICE: Symbol.for('TOKEN_SERVICE'),
}

export const DATABASE_URL = process.env.DATABASE_URL

export const REDIS_URL = process.env.REDIS_URL

export const MAILER_CONNECTION_OPTIONS: MailerAuthOption = {
    smtp: process.env.EMAIL_SMTP || '',
    port: parseInt(process.env.EMAIL_SMTP_PORT || ''),
    user: process.env.EMAIL || '',
    password: process.env.EMAIL_PASSWORD || '',
}

export const PORT: string | number = process.env.PORT || 5000
