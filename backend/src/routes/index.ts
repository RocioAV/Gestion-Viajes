import { Router } from 'express'
import { authRouter } from './auth.routes'
import { driverRouter } from './driver.routes'
import { vehicleRouter } from './vehicle.routes'

export const apiRouter: ReturnType<typeof Router> = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/drivers', driverRouter)
apiRouter.use('/vehicles', vehicleRouter)
