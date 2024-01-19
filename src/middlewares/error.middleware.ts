import Logger from '@class/Logger'

import { NextFunction, Request, Response } from 'express'
import { HttpError } from '@class/Error'

function errorMiddleware(error: unknown, _: Request, response: Response, __: NextFunction) {
    if (error instanceof HttpError) {
        const { statusCode, ...data } = error
        return response.status(statusCode).json(data)
    }

    Logger.error(error)

    return response.status(404).send({
        error: 'Does not exist',
        message: 'Does not exist',
    })
}

export default errorMiddleware
