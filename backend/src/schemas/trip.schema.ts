import * as v from 'valibot'

export const createTripSchema = v.object({
  vehicle_id: v.pipe(v.number(), v.minValue(1, 'El ID del vehículo es requerido')),
  occupied_seats: v.pipe(v.number(), v.minValue(1, 'Debe haber al menos 1 asiento ocupado')),
  price_per_passenger: v.optional(v.pipe(v.number(), v.minValue(0))),
  base_commission: v.optional(v.pipe(v.number(), v.minValue(0))),
})

export const tripFiltersSchema = v.object({
  status: v.optional(
    v.union(
      [v.literal('IN_PROGRESS'), v.literal('COMPLETED'), v.literal('CANCELLED')],
      'Estado debe ser IN_PROGRESS, COMPLETED o CANCELLED',
    ),
  ),
  origin: v.optional(
    v.union([v.literal('JUJUY'), v.literal('SALTA')], 'Origen debe ser JUJUY o SALTA'),
  ),
  destination: v.optional(
    v.union([v.literal('JUJUY'), v.literal('SALTA')], 'Destino debe ser JUJUY o SALTA'),
  ),
  vehicle_id: v.optional(v.pipe(v.number(), v.minValue(1))),
  departure_operator_id: v.optional(v.pipe(v.number(), v.minValue(1))),
  date_from: v.optional(v.string()),
  date_to: v.optional(v.string()),
})

export type CreateTripInput = v.InferOutput<typeof createTripSchema>
export type TripFilters = v.InferOutput<typeof tripFiltersSchema>
