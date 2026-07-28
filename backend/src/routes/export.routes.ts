import { Router } from 'express'
import { handleExportTrips } from '../controllers/export.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

export const exportRouter: ReturnType<typeof Router> = Router()

exportRouter.use(authMiddleware)

exportRouter.get('/trips', handleExportTrips)
