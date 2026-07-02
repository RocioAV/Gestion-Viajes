import { Router } from 'express'
import { handleCancelTrip, handleCompleteTrip, handleCreateTrip, handleGetTrips } from '../controllers/trip.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validate.middleware'
import { createTripSchema } from '../schemas/trip.schema'

export const tripRouter: ReturnType<typeof Router> = Router()

tripRouter.use(authMiddleware)

tripRouter.post('/', validate(createTripSchema), handleCreateTrip)
tripRouter.get('/', handleGetTrips)
tripRouter.patch('/:id/complete', handleCompleteTrip)
tripRouter.patch('/:id/cancel', handleCancelTrip)
