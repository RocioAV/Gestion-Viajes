import type { NextFunction, Request, Response } from 'express'
import * as v from 'valibot'
import { vehicleFiltersSchema } from '../schemas/vehicle.schema'
import { createVehicle, deleteVehicle, getVehicleById, getVehicles, updateVehicle } from '../services/vehicle.service'

export async function handleCreateVehicle(req: Request, res: Response, next: NextFunction) {
  try {
    const vehicle = await createVehicle(req.body, req.user!.assigned_location!)
    res.status(201).json({ message: 'Vehículo creado exitosamente', vehicle })
  }
  catch (error) {
    next(error)
  }
}

export async function handleGetVehicles(req: Request, res: Response, next: NextFunction) {
  try {
    const result = v.safeParse(vehicleFiltersSchema, {
      status: req.query.status ?? undefined,
      current_location: req.query.current_location ?? undefined,
      driver_id: req.query.driver_id ? Number(req.query.driver_id) : undefined,
      model: req.query.model ?? undefined,
    })
    const filters = result.success ? result.output : {}
    const vehicles = await getVehicles(filters)
    res.json({ vehicles })
  }
  catch (error) {
    next(error)
  }
}

export async function handleGetVehicleById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const vehicle = await getVehicleById(id)
    res.json({ vehicle })
  }
  catch (error) {
    next(error)
  }
}

export async function handleUpdateVehicle(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const vehicle = await updateVehicle(id, req.body)
    res.json({ message: 'Vehículo actualizado exitosamente', vehicle })
  }
  catch (error) {
    next(error)
  }
}

export async function handleDeleteVehicle(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    await deleteVehicle(id)
    res.json({ message: 'Vehículo eliminado exitosamente' })
  }
  catch (error) {
    next(error)
  }
}
