import { Router } from 'express'
import { handleGetNextTrips } from '../controllers/public.controller'

export const publicRouter: ReturnType<typeof Router> = Router()

publicRouter.get('/next-trips', handleGetNextTrips)
