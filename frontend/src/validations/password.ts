import type { InferOutput } from 'valibot'
import { email, minLength, object, pipe, string } from 'valibot'

export const ChangePasswordSchema = object({
  currentPassword: pipe(string(), minLength(1, 'La contraseña actual es requerida')),
  newPassword: pipe(string(), minLength(6, 'La nueva contraseña debe tener al menos 6 caracteres')),
  confirmPassword: pipe(string(), minLength(1, 'Confirmá la nueva contraseña')),
})

export const ResetPasswordSchema = object({
  newPassword: pipe(string(), minLength(6, 'La nueva contraseña debe tener al menos 6 caracteres')),
  confirmPassword: pipe(string(), minLength(1, 'Confirmá la nueva contraseña')),
})

export type ChangePasswordFormData = InferOutput<typeof ChangePasswordSchema>
export type ResetPasswordFormData = InferOutput<typeof ResetPasswordSchema>
