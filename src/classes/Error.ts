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
    constructor(public error: ValidationError[]) {
        super(400, 'Validation error')
    }
}

export { HttpError, ApplicationError, BadRequestError, ValidationError }
