import { email, minLength, string, object, picklist, pipe, type InferOutput } from 'valibot'

export const LoginSchema = object({
  email: pipe(string(), minLength(1, 'El correo es requerido'), email('Correo inválido')),
  password: pipe(string(), minLength(1, 'La contraseña es requerida')),
})

export const RegistroSchema = object({
  name: pipe(string(), minLength(1, 'El nombre es requerido')),
  email: pipe(string(), minLength(1, 'El correo es requerido'), email('Correo inválido')),
  password: pipe(string(), minLength(1, 'La contraseña es requerida')),
  assigned_location: picklist(['JUJUY', 'SALTA'], 'Seleccioná una sede'),
})

export type LoginFormData = InferOutput<typeof LoginSchema>
export type RegistroFormData = InferOutput<typeof RegistroSchema>
