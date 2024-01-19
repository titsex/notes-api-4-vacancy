import 'reflect-metadata'

import errorMiddleware from '@middleware/error.middleware'
import Database from '@class/Database'
import Mailer from '@class/Mailer'
import Logger from '@class/Logger'
import Cache from '@class/Cache'
import express from 'express'
import router from '@router'

import { PORT, DATABASE_URL, REDIS_URL, MAILER_CONNECTION_OPTIONS } from '@consts'
import { ApplicationError } from '@class/Error'
import { asyncHandlerStack } from '@utils'

const application = express()

const bootstrap = async () => {
    try {
        await Mailer.connect(MAILER_CONNECTION_OPTIONS)
        await Database.connect(DATABASE_URL!)
        await Cache.connect(REDIS_URL!)

        application.use(express.json())
        application.use('/api', asyncHandlerStack(router))
        application.use(errorMiddleware)

        application.listen(typeof PORT === 'number' ? PORT : parseInt(PORT), () =>
            Logger.info('Server has been successfully started!')
        )
    } catch (error) {
        if (error instanceof Error) Logger.error(error.message)
        else if (error instanceof ApplicationError) Logger.applicationError(error)
        else Logger.error(String(error))
    }
}

bootstrap()
