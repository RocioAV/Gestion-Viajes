import * as v from 'valibot'

export const createVehicleSchema = v.object({
  license_plate: v.pipe(v.string(), v.minLength(1, 'La patente es requerida')),
  model: v.pipe(v.string(), v.minLength(1, 'El modelo es requerido')),
  passenger_capacity: v.pipe(v.number(), v.minValue(1, 'La capacidad debe ser al menos 1')),
  driver_id: v.pipe(v.number(), v.minValue(1, 'El ID del chofer es requerido')),
})

export const updateVehicleSchema = v.partial(createVehicleSchema)

export const vehicleFiltersSchema = v.object({
  status: v.optional(
    v.union(
      [v.literal('AVAILABLE'), v.literal('ON_TRIP'), v.literal('OUT_OF_SERVICE')],
      'Estado debe ser AVAILABLE, ON_TRIP o OUT_OF_SERVICE',
    ),
  ),
  current_location: v.optional(
    v.union([v.literal('JUJUY'), v.literal('SALTA')], 'Ubicación debe ser JUJUY o SALTA'),
  ),
  driver_id: v.optional(v.pipe(v.number(), v.minValue(1))),
  model: v.optional(v.string()),
})

export type CreateVehicleInput = v.InferOutput<typeof createVehicleSchema>
export type UpdateVehicleInput = v.InferOutput<typeof updateVehicleSchema>
export type VehicleFilters = v.InferOutput<typeof vehicleFiltersSchema>
