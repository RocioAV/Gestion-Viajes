import { Router } from 'express'
import { handleDeleteUser, handleGetUsers } from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

export const userRouter: ReturnType<typeof Router> = Router()

userRouter.use(authMiddleware)

userRouter.get('/', handleGetUsers)
userRouter.delete('/:id', handleDeleteUser)
