import { Router } from 'express'
import { handleCreateVehicle, handleDeleteVehicle, handleGetVehicleById, handleGetVehicles, handleSetVehicleAvailable, handleSetVehicleOutOfService, handleUpdateVehicle } from '../controllers/vehicle.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validate.middleware'
import { createVehicleSchema, updateVehicleSchema } from '../schemas/vehicle.schema'

export const vehicleRouter: ReturnType<typeof Router> = Router()

vehicleRouter.use(authMiddleware)

vehicleRouter.post('/', validate(createVehicleSchema), handleCreateVehicle)
vehicleRouter.get('/', handleGetVehicles)
vehicleRouter.get('/:id', handleGetVehicleById)
vehicleRouter.patch('/:id/available', handleSetVehicleAvailable)
vehicleRouter.patch('/:id/outservice', handleSetVehicleOutOfService)
vehicleRouter.put('/:id', validate(updateVehicleSchema), handleUpdateVehicle)
vehicleRouter.delete('/:id', handleDeleteVehicle)
