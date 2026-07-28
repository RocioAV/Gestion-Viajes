import type { NextFunction, Request, Response } from 'express'
import { getNextTrips } from '../services/public.service'

export async function handleGetNextTrips(_req: Request, res: Response, next: NextFunction) {
  try {
    const result = await getNextTrips()
    res.json(result)
  }
  catch (error) {
    next(error)
  }
}
