import authRouter from '@route/auth.routes'

import { Router } from 'express'

const router = Router()

router.use('/auth', authRouter)

export default router
