import { email, minLength, object, pipe, string } from 'valibot'

export const RecuperarPasswordSchema = object({
  email: pipe(string(), minLength(1, 'El correo es requerido'), email('Correo inválido')),
})
