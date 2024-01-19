import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { ValidationError } from '@class/Error'

function validationMiddleware(request: Request, response: Response, next: NextFunction) {
    const result = validationResult(request)
    const errors = result.array()

    // express-validator has a slightly crooked typing.
    if (!result.isEmpty()) throw new ValidationError(errors as unknown as ValidationError[])

    next()
}

export default validationMiddleware
