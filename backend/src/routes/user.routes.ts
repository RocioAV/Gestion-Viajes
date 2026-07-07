import { Router } from 'express'
import { handleDeleteUser, handleGetUsers, handleResetPassword } from '../controllers/user.controller'
import { authMiddleware, requireRole } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validate.middleware'
import { resetPasswordSchema } from '../schemas/auth.schema'

export const userRouter: ReturnType<typeof Router> = Router()

userRouter.use(authMiddleware)

userRouter.get('/', handleGetUsers)
userRouter.delete('/:id', handleDeleteUser)
userRouter.put(
  '/:id/reset-password',
  requireRole('ADMIN'),
  validate(resetPasswordSchema),
  handleResetPassword,
)
