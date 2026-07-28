import { Router } from 'express'
import { authRouter } from './auth.routes.js'
import { driverRouter } from './driver.routes.js'
import { exportRouter } from './export.routes.js'
import { publicRouter } from './public.routes.js'
import { settingRouter } from './setting.routes.js'
import { tripRouter } from './trip.routes.js'
import { userRouter } from './user.routes.js'
import { vehicleRouter } from './vehicle.routes.js'

export const apiRouter: ReturnType<typeof Router> = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/drivers', driverRouter)
apiRouter.use('/public', publicRouter)
apiRouter.use('/users', userRouter)
apiRouter.use('/vehicles', vehicleRouter)
apiRouter.use('/trips', tripRouter)
apiRouter.use('/settings', settingRouter)
apiRouter.use('/export', exportRouter)
