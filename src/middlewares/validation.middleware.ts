import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { ValidationError } from '@class/Error'

function validationMiddleware(request: Request, response: Response, next: NextFunction) {
    const result = validationResult(request)
    if (result.isEmpty()) return next()

    const errors = result.array()
    throw new ValidationError(errors)
}

export default validationMiddleware
