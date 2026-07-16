import { Router } from 'express'
import { handleChangePassword, handleLogin, handleRegister } from '../controllers/auth.controller'
import { authMiddleware, requireRole } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validate.middleware'
import { changePasswordSchema, loginSchema, registerSchema } from '../schemas/auth.schema'

export const authRouter: ReturnType<typeof Router> = Router()

authRouter.post('/login', validate(loginSchema), handleLogin)
authRouter.post(
  '/register',
  authMiddleware,
  requireRole('ADMIN'),
  validate(registerSchema),
  handleRegister,
)
authRouter.put(
  '/change-password',
  authMiddleware,
  validate(changePasswordSchema),
  handleChangePassword,
)
