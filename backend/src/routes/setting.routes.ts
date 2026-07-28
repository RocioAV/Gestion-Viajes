import { Router } from 'express'
import { handleGetBasePrice, handleUpdateBasePrice } from '../controllers/setting.controller.js'
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { updateBasePriceSchema } from '../schemas/setting.schema.js'

export const settingRouter: ReturnType<typeof Router> = Router()

settingRouter.use(authMiddleware)

settingRouter.get('/base-price', handleGetBasePrice)
settingRouter.patch('/base-price', validate(updateBasePriceSchema), requireRole('ADMIN'), handleUpdateBasePrice)
