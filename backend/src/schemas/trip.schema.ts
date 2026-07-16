import * as v from 'valibot'

export const tripStatusEnum = v.union(
  [v.literal('PENDING'), v.literal('IN_PROGRESS'), v.literal('COMPLETED'), v.literal('CANCELLED')],
  'Estado debe ser PENDING, IN_PROGRESS, COMPLETED o CANCELLED',
)

export const locationEnum = v.union(
  [v.literal('JUJUY'), v.literal('SALTA')],
  'Ubicación debe ser JUJUY o SALTA',
)

export const createTripSchema = v.object({
  vehicle_id: v.pipe(v.number(), v.minValue(1, 'El ID del vehículo es requerido')),
  occupied_seats: v.pipe(v.number(), v.minValue(1, 'Debe haber al menos 1 asiento ocupado')),
  price_per_passenger: v.optional(v.pipe(v.number(), v.minValue(0))),
  base_commission: v.optional(v.pipe(v.number(), v.minValue(0))),
})

export const joinQueueSchema = v.object({
  vehicle_id: v.pipe(v.number(), v.minValue(1, 'El ID del vehículo es requerido')),
})

export const addPassengerSchema = v.object({
  count: v.pipe(v.number(), v.minValue(1, 'Debe agregar al menos 1 pasajero')),
})

export const removePassengerSchema = v.object({
  count: v.pipe(v.number(), v.minValue(1, 'Debe quitar al menos 1 pasajero')),
})

export const tripFiltersSchema = v.object({
  status: v.optional(tripStatusEnum),
  origin: v.optional(locationEnum),
  destination: v.optional(locationEnum),
  vehicle_id: v.optional(v.pipe(v.number(), v.minValue(1))),
  departure_operator_id: v.optional(v.pipe(v.number(), v.minValue(1))),
  date_from: v.optional(v.string()),
  date_to: v.optional(v.string()),
})

export const queueFiltersSchema = v.object({
  destination: locationEnum,
})

export type CreateTripInput = v.InferOutput<typeof createTripSchema>
export type JoinQueueInput = v.InferOutput<typeof joinQueueSchema>
export type AddPassengerInput = v.InferOutput<typeof addPassengerSchema>
export type RemovePassengerInput = v.InferOutput<typeof removePassengerSchema>
export type TripFilters = v.InferOutput<typeof tripFiltersSchema>
export type QueueFilters = v.InferOutput<typeof queueFiltersSchema>
