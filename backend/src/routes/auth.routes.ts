import { Router } from 'express'
import { handleChangePassword, handleLogin, handleRegister } from '../controllers/auth.controller.js'
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { changePasswordSchema, loginSchema, registerSchema } from '../schemas/auth.schema.js'

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
