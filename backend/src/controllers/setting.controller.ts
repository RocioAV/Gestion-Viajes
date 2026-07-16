import type { NextFunction, Request, Response } from 'express'
import { getBasePrice, updateBasePrice } from '../services/setting.service'

export async function handleGetBasePrice(req: Request, res: Response, next: NextFunction) {
  try {
    const setting = await getBasePrice()
    res.json({ setting })
  }
  catch (error) {
    next(error)
  }
}

export async function handleUpdateBasePrice(req: Request, res: Response, next: NextFunction) {
  try {
    const { value } = req.body
    const setting = await updateBasePrice(value)
    res.json({ message: 'Precio base actualizado exitosamente', setting })
  }
  catch (error) {
    next(error)
  }
}
