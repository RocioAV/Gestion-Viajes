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

export const changePasswordSchema = v.object({
  currentPassword: v.pipe(v.string(), v.minLength(1, 'La contraseña actual es requerida')),
  newPassword: v.pipe(v.string(), v.minLength(6, 'La nueva contraseña debe tener al menos 6 caracteres')),
  confirmPassword: v.pipe(v.string(), v.minLength(1, 'Confirmá la nueva contraseña')),
})

export const resetPasswordSchema = v.object({
  newPassword: v.pipe(v.string(), v.minLength(6, 'La nueva contraseña debe tener al menos 6 caracteres')),
  confirmPassword: v.pipe(v.string(), v.minLength(1, 'Confirmá la nueva contraseña')),
})
