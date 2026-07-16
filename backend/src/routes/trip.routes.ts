import { Router } from 'express'
import { handleAddPassenger, handleCancelTrip, handleCompleteTrip, handleCreateTrip, handleGetQueue, handleGetTrips, handleJoinQueue, handleRemovePassenger } from '../controllers/trip.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validate.middleware'
import { addPassengerSchema, createTripSchema, joinQueueSchema, removePassengerSchema } from '../schemas/trip.schema'

export const tripRouter: ReturnType<typeof Router> = Router()

tripRouter.use(authMiddleware)

tripRouter.post('/', validate(createTripSchema), handleCreateTrip)
tripRouter.post('/join-queue', validate(joinQueueSchema), handleJoinQueue)
tripRouter.get('/queue', handleGetQueue)
tripRouter.get('/', handleGetTrips)
tripRouter.patch('/:id/complete', handleCompleteTrip)
tripRouter.patch('/:id/cancel', handleCancelTrip)
tripRouter.patch('/:id/passengers', validate(addPassengerSchema), handleAddPassenger)
tripRouter.patch('/:id/passengers/remove', validate(removePassengerSchema), handleRemovePassenger)
