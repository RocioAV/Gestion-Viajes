import * as v from 'valibot'

export const createDriverSchema = v.object({
  first_name: v.pipe(v.string(), v.minLength(1, 'El nombre es requerido')),
  last_name: v.pipe(v.string(), v.minLength(1, 'El apellido es requerido')),
  phone: v.pipe(v.string(), v.minLength(1, 'El teléfono es requerido')),
  national_id: v.pipe(v.string(), v.minLength(1, 'El DNI es requerido')),
})

export const updateDriverSchema = v.partial(createDriverSchema)

export type CreateDriverInput = v.InferOutput<typeof createDriverSchema>
export type UpdateDriverInput = v.InferOutput<typeof updateDriverSchema>
