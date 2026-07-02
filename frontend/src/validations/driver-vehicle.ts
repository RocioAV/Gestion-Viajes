import type { InferOutput } from 'valibot'
import { minLength, minValue, number, object, picklist, pipe, string } from 'valibot'

export const DriverSchema = object({
  first_name: pipe(string(), minLength(1, 'El nombre es requerido')),
  last_name: pipe(string(), minLength(1, 'El apellido es requerido')),
  phone: pipe(string(), minLength(1, 'El teléfono es requerido')),
  national_id: pipe(string(), minLength(1, 'El DNI es requerido')),
})

export const VehicleSchema = object({
  license_plate: pipe(string(), minLength(1, 'La patente es requerida')),
  model: pipe(string(), minLength(1, 'El modelo es requerido')),
  passenger_capacity: pipe(number(), minValue(1, 'La capacidad mínima es 1')),
  current_location: picklist(['JUJUY', 'SALTA'], 'Seleccioná una sede'),
})

export type DriverFormData = InferOutput<typeof DriverSchema>
export type VehicleFormData = InferOutput<typeof VehicleSchema>
