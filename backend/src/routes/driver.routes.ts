import { Router } from 'express'
import { handleCreateDriver, handleDeleteDriver, handleGetDriverById, handleGetDrivers, handleToggleAvailability, handleUpdateDriver } from '../controllers/driver.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validate.middleware'
import { createDriverSchema, updateDriverSchema } from '../schemas/driver.schema'

export const driverRouter: ReturnType<typeof Router> = Router()

driverRouter.use(authMiddleware)

driverRouter.post('/', validate(createDriverSchema), handleCreateDriver)
driverRouter.get('/', handleGetDrivers)
driverRouter.get('/:id', handleGetDriverById)
driverRouter.put('/:id', validate(updateDriverSchema), handleUpdateDriver)
driverRouter.delete('/:id', handleDeleteDriver)
driverRouter.patch('/:id/toggle-availability', handleToggleAvailability)
