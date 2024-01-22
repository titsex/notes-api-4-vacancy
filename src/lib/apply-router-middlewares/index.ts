import { ExpressMiddleware, ExpressRoute, ExpressStack } from '../types'
import { Router } from 'express'

function putMiddlewareToRoute(route: ExpressRoute, middleware: ExpressMiddleware) {
    let stacks = [...route.stack]

    const leftMiddlewares = stacks.slice(middleware.position, stacks.length)
    stacks = stacks.slice(0, middleware.position)

    const stack = Object.assign(Object.create(Object.getPrototypeOf(route.stack.at(-1))), route.stack.at(-1))

    stack.handle = middleware.handle
    stack.name = middleware.name

    stacks.push(stack)
    stacks.push(...leftMiddlewares)

    return stacks
}

export default function applyRouterMiddlewares(router: Router, ...middlewares: ExpressMiddleware[]) {
    router.stack = router.stack.map((stack: ExpressStack) => {
        if (stack.name === 'router') {
            stack.handle.stack = stack.handle.stack.map((stack) => {
                if (stack.name === 'bound dispatch' && Array.isArray(stack.stack)) {
                    for (const middleware of middlewares) {
                        stack.stack = putMiddlewareToRoute(stack, middleware)
                        stack.route.stack = putMiddlewareToRoute(stack.route, middleware)
                    }
                }

                return stack
            })
        }

        return stack
    })

    return router
}
