import type { CorsOptions } from 'cors'
import process from 'node:process'

const allowedOrigins: string[] = [
  process.env.CORS_ORIGIN,
].filter((origin): origin is string => Boolean(origin))

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true)
      return
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }

    callback(null, false)
  },
  credentials: true,
}
