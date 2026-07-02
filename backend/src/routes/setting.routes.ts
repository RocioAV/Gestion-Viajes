import { Router } from 'express'
import { handleGetBasePrice, handleUpdateBasePrice } from '../controllers/setting.controller'
import { authMiddleware, requireRole } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validate.middleware'
import { updateBasePriceSchema } from '../schemas/setting.schema'

export const settingRouter: ReturnType<typeof Router> = Router()

settingRouter.use(authMiddleware)

settingRouter.get('/base-price', handleGetBasePrice)
settingRouter.patch('/base-price', validate(updateBasePriceSchema), requireRole('ADMIN'), handleUpdateBasePrice)
