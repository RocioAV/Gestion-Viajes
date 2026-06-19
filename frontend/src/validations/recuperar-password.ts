import { email, minLength, string, object, pipe } from 'valibot'

export const RecuperarPasswordSchema = object({
  email: pipe(string(), minLength(1, 'El correo es requerido'), email('Correo inválido')),
})
