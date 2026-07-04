import type { NextFunction, Request, Response } from 'express'
import * as v from 'valibot'
import { queueFiltersSchema, tripFiltersSchema } from '../schemas/trip.schema'
import { addPassenger, cancelTrip, completeTrip, createTrip, getQueue, getTrips, joinQueue } from '../services/trip.service'

export async function handleCreateTrip(req: Request, res: Response, next: NextFunction) {
  try {
    const trip = await createTrip(req.body, {
      userId: req.user!.userId,
      assigned_location: req.user!.assigned_location!,
    })
    res.status(201).json({ message: 'Viaje creado exitosamente', trip })
  }
  catch (error) {
    next(error)
  }
}

export async function handleJoinQueue(req: Request, res: Response, next: NextFunction) {
  try {
    const trip = await joinQueue(req.body, {
      userId: req.user!.userId,
      assigned_location: req.user!.assigned_location!,
    })
    res.status(201).json({ message: 'Vehículo ingresado a la cola exitosamente', trip })
  }
  catch (error) {
    next(error)
  }
}

export async function handleGetQueue(req: Request, res: Response, next: NextFunction) {
  try {
    const result = v.safeParse(queueFiltersSchema, {
      destination: req.query.destination,
    })

    if (!result.success) {
      res.status(400).json({
        error: 'Validation failed',
        issues: v.flatten(result.issues),
      })
      return
    }

    const trips = await getQueue(result.output)
    res.json({ trips })
  }
  catch (error) {
    next(error)
  }
}

export async function handleAddPassenger(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const trip = await addPassenger(id, req.body)
    res.json({ message: 'Pasajeros agregados exitosamente', trip })
  }
  catch (error) {
    next(error)
  }
}

export async function handleGetTrips(req: Request, res: Response, next: NextFunction) {
  try {
    const result = v.safeParse(tripFiltersSchema, {
      status: req.query.status ?? undefined,
      origin: req.query.origin ?? undefined,
      destination: req.query.destination ?? undefined,
      vehicle_id: req.query.vehicle_id ? Number(req.query.vehicle_id) : undefined,
      departure_operator_id: req.query.departure_operator_id ? Number(req.query.departure_operator_id) : undefined,
      date_from: req.query.date_from ?? undefined,
      date_to: req.query.date_to ?? undefined,
    })
    const filters = result.success ? result.output : {}
    const trips = await getTrips(filters)
    res.json({ trips })
  }
  catch (error) {
    next(error)
  }
}

export async function handleCompleteTrip(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const trip = await completeTrip(id, {
      userId: req.user!.userId,
      assigned_location: req.user!.assigned_location!,
    })
    res.json({ message: 'Viaje completado exitosamente', trip })
  }
  catch (error) {
    next(error)
  }
}

export async function handleCancelTrip(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const trip = await cancelTrip(id)
    res.json({ message: 'Viaje cancelado exitosamente', trip })
  }
  catch (error) {
    next(error)
  }
}
