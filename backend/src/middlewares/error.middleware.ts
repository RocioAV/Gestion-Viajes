import type { ErrorRequestHandler } from 'express'
import process from 'node:process'

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = err.status ?? err.statusCode ?? 500
  const message = err.message ?? 'Internal server error'

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
