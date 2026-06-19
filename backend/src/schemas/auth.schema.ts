import * as v from 'valibot'

export const loginSchema = v.object({
  email: v.pipe(v.string(), v.email('Correo electrónico no es válido')),
  password: v.pipe(v.string(), v.minLength(1, 'La contraseña es requerida')),
})

export const registerSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, 'Nombre es requerido')),
  email: v.pipe(v.string(), v.email('Correo electrónico no es válido')),
  password: v.pipe(v.string(), v.minLength(6, 'La contraseña debe tener al menos 6 caracteres')),
  assigned_location: v.union([v.literal('JUJUY'), v.literal('SALTA')], 'Ubicación asignada debe ser JUJUY o SALTA'),
})
