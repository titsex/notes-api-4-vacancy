import { ValidationError as ExpressValidationError } from 'express-validator'
import { ApplicationErrorPrefixes } from '@types'

class ApplicationError {
    constructor(
        public prefix: ApplicationErrorPrefixes,
        public message: string
    ) {}
}

abstract class HttpError {
    protected constructor(
        public statusCode: number,
        public message: string
    ) {}
}

class BadRequestError extends HttpError {
    constructor(public error: string) {
        super(400, 'Bad request error')
    }
}

class ValidationError extends HttpError {
    constructor(public error: ExpressValidationError[]) {
        super(400, 'Validation error')
    }
}

class UnauthorizeError extends HttpError {
    constructor(public error = 'Unauthorized') {
        super(401, 'You must be logged in')
    }
}

export { HttpError, ApplicationError, BadRequestError, ValidationError, UnauthorizeError }
