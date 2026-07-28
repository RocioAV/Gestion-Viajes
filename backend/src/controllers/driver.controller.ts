import type { NextFunction, Request, Response } from 'express'
import { createDriver, deleteDriver, getDriverById, getDrivers, restoreDriver, toggleAvailability, updateDriver } from '../services/driver.service'

export async function handleCreateDriver(req: Request, res: Response, next: NextFunction) {
  try {
    const driver = await createDriver(req.body)
    res.status(201).json({ message: 'Chofer creado exitosamente', driver })
  }
  catch (error) {
    next(error)
  }
}

export async function handleGetDrivers(req: Request, res: Response, next: NextFunction) {
  try {
    const includeDeleted = req.query.include_deleted === 'true'
    const drivers = await getDrivers(includeDeleted)
    res.json({ drivers })
  }
  catch (error) {
    next(error)
  }
}

export async function handleGetDriverById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const driver = await getDriverById(id)
    res.json({ driver })
  }
  catch (error) {
    next(error)
  }
}

export async function handleUpdateDriver(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const driver = await updateDriver(id, req.body)
    res.json({ message: 'Chofer actualizado exitosamente', driver })
  }
  catch (error) {
    next(error)
  }
}

export async function handleDeleteDriver(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    await deleteDriver(id)
    res.json({ message: 'Chofer eliminado exitosamente' })
  }
  catch (error) {
    next(error)
  }
}

export async function handleRestoreDriver(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    await restoreDriver(id)
    res.json({ message: 'Chofer restaurado correctamente' })
  }
  catch (error) {
    next(error)
  }
}

export async function handleToggleAvailability(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const driver = await toggleAvailability(id)
    res.json({ message: 'Disponibilidad actualizada', driver })
  }
  catch (error) {
    next(error)
  }
}
