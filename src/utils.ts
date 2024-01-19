import validationMiddleware from '@middleware/validation.middleware'

import { CustomRoute, expressFn } from '@types'
import { Router, Request } from 'express'
import { randomBytes } from 'crypto'

export const getIp = (request: Request) =>
    request.headers['x-forwarded-for']?.toString() || request.socket.remoteAddress!.toString()

export const randomString = (length: number) => randomBytes(length).toString('hex')

export const randomNumber = (minimum: number, maximum: number) =>
    Math.floor(Math.random() * (maximum - minimum + 1) + minimum)

export const generateUniqueHex = async (): Promise<string> => randomString(randomNumber(10, 20))

export const asyncHandler =
    (fn: expressFn): expressFn =>
    (req, res, next) =>
        Promise.resolve(fn(req, res, next)).catch(next)

const changeRouteHandle = (route: CustomRoute) => {
    return route.stack.map((stack) => {
        if (stack.handle.constructor.name === 'AsyncFunction') stack.handle = asyncHandler(stack.handle)

        return stack
    })
}

const addValidationMiddlewareToStack = (stack: CustomRoute) => {
    const stacks = [...stack.stack]

    if (stacks.length <= 1) return stacks
    if (!stacks.find((x) => x.name === 'middleware')) return stacks

    const controller = stacks.pop()
    const middleware = Object.assign(Object.create(Object.getPrototypeOf(controller)), controller)

    middleware.handle = validationMiddleware
    middleware.name = 'validationMiddleware'

    stacks.push(middleware)
    stacks.push(controller!)

    return stacks
}

// It looks like dirty code, in fact it is, but I'm too lazy to manually add middleware validations everywhere.
// This code also makes all routes asynchronous.
export const asyncHandlerStack = (router: Router) => {
    router.stack = router.stack.map((stack) => {
        if (stack.name === 'bound dispatch') stack.stack = changeRouteHandle(stack.route)
        else if (stack.name === 'router') asyncHandlerStack(stack.handle)

        if (stack.name === 'bound dispatch' && Array.isArray(stack.stack)) {
            stack.stack = addValidationMiddlewareToStack(stack)
            stack.route.stack = addValidationMiddlewareToStack(stack.route)
        }

        return stack
    })

    return router
}
