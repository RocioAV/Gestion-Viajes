import { Router } from 'express'
import { handleCreateDriver, handleDeleteDriver, handleGetDriverById, handleGetDrivers, handleRestoreDriver, handleToggleAvailability, handleUpdateDriver } from '../controllers/driver.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { createDriverSchema, updateDriverSchema } from '../schemas/driver.schema.js'

export const driverRouter: ReturnType<typeof Router> = Router()

driverRouter.use(authMiddleware)

driverRouter.post('/', validate(createDriverSchema), handleCreateDriver)
driverRouter.get('/', handleGetDrivers)
driverRouter.get('/:id', handleGetDriverById)
driverRouter.put('/:id', validate(updateDriverSchema), handleUpdateDriver)
driverRouter.delete('/:id', handleDeleteDriver)
driverRouter.patch('/:id/restore', handleRestoreDriver)
driverRouter.patch('/:id/toggle-availability', handleToggleAvailability)
