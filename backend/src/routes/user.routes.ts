import { Router } from 'express'
import { handleDeleteUser, handleGetUsers, handleResetPassword, handleRestoreUser } from '../controllers/user.controller.js'
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { resetPasswordSchema } from '../schemas/auth.schema.js'

export const userRouter: ReturnType<typeof Router> = Router()

userRouter.use(authMiddleware)

userRouter.get('/', handleGetUsers)
userRouter.delete('/:id', handleDeleteUser)
userRouter.patch('/:id/restore', requireRole('ADMIN'), handleRestoreUser)
userRouter.put(
  '/:id/reset-password',
  requireRole('ADMIN'),
  validate(resetPasswordSchema),
  handleResetPassword,
)
