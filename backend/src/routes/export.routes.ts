import { Router } from 'express'
import { handleExportTrips } from '../controllers/export.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

export const exportRouter: ReturnType<typeof Router> = Router()

exportRouter.use(authMiddleware)

exportRouter.get('/trips', handleExportTrips)
