import 'reflect-metadata'

import applyRouterMiddlewares from '@lib/apply-router-middlewares'
import asyncRouterHandlers from '@lib/async-router-handlers'
import errorMiddleware from '@middleware/error.middleware'
import Database from '@class/Database'
import Mailer from '@class/Mailer'
import Logger from '@class/Logger'
import Cache from '@class/Cache'
import express from 'express'
import router from '@router'

import { DATABASE_URL, MAILER_CONNECTION_OPTIONS, PORT, REDIS_URL } from '@consts'
import { ApplicationError } from '@class/Error'
import validationMiddleware from '@middleware/validation.middleware'

const application = express()

const bootstrap = async () => {
    try {
        await Mailer.connect(MAILER_CONNECTION_OPTIONS)
        await Database.connect(DATABASE_URL!)
        await Cache.connect(REDIS_URL!)

        application.use(express.json())

        application.use(
            '/api',
            applyRouterMiddlewares(asyncRouterHandlers(router), {
                handle: validationMiddleware,
                name: 'validationMiddleware',
                position: -1,
            })
        )

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
