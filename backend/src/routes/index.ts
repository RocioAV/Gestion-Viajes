import { Router } from 'express'
import { authRouter } from './auth.routes'

export const apiRouter: ReturnType<typeof Router> = Router()

apiRouter.use('/auth', authRouter)
