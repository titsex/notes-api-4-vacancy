import { NextFunction, Request, Response, Router } from 'express'

export type ExpressFunction = (request: Request, response: Response, next: NextFunction) => unknown

export interface ExpressRoute {
    stack: ExpressRoute[]
    handle: ExpressFunction
}

export interface ExpressStack {
    name: string
    handle: Router
    stack: ExpressRoute[]
    route: ExpressRoute
}

export interface ExpressMiddleware {
    handle: ExpressFunction
    name: string
    position: number
}
