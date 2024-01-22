import SMTPTransport from 'nodemailer/lib/smtp-transport'
import Logger from '@class/Logger'

import { ApplicationErrorPrefixes, MailerAuthOption, MailerConnectionErrors } from '@types'
import { createTransport, Transporter } from 'nodemailer'
import { MAILER_CONNECTION_OPTIONS } from '@consts'
import { ApplicationError } from '@class/Error'

class Mailer {
    private static client: Transporter<SMTPTransport.SentMessageInfo>

    public static async connect(options: MailerAuthOption) {
        Mailer.client = createTransport({
            secure: true,
            host: options.smtp,
            port: options.port,
            auth: {
                user: options.user,
                pass: options.password,
            },
        })

        // Since nodemailer does not have a built-in connection check, I use this dirty hack.
        Mailer.send('', '', '').catch((error) => {
            if (error instanceof Error) {
                if ('responseCode' in error && error.responseCode === MailerConnectionErrors.INVALID_AUTH) {
                    throw new ApplicationError(
                        ApplicationErrorPrefixes.MAILER_CONNECTION,
                        'Check if you have specified EMAIL, EMAIL_SMTP, EMAIL_SMTP_PORT, EMAIL_PASSWORD in .env'
                    )
                }
            }
        })

        Logger.info('Mailer has been successfully connected!')
    }

    public static async send(to: string, subject: string, message: string) {
        await Mailer.client.sendMail({
            from: MAILER_CONNECTION_OPTIONS.user,
            to,
            subject,
            text: message,
        })
    }
}

export default Mailer
