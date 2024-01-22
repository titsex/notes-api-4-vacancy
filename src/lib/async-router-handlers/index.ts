import { ExpressFunction, ExpressRoute, ExpressStack } from '../types'
import { NextFunction, Request, Response, Router } from 'express'

function convertHandlerToPromise(handler: ExpressFunction) {
    return function (request: Request, response: Response, next: NextFunction) {
        return Promise.resolve(handler(request, response, next)).catch(next)
    }
}

function changeRouteHandlers(route: ExpressRoute) {
    return route.stack.map((stack) => {
        if (stack.handle.constructor.name === 'AsyncFunction') stack.handle = convertHandlerToPromise(stack.handle)

        return stack
    })
}

export default function asyncRouterHandlers(router: Router) {
    router.stack = router.stack.map((stack: ExpressStack) => {
        if (stack.name === 'bound dispatch') {
            stack.stack = changeRouteHandlers(stack.route)
        } else if (stack.name === 'router') asyncRouterHandlers(stack.handle)

        return stack
    })

    return router
}
