import type { FormEvent } from 'react'
import type { InferOutput } from 'valibot'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { safeParse } from 'valibot'
import FormLayout from '../components/FormLayout'
import { RecuperarPasswordSchema } from '../validations/recuperar-password'

type RecuperarPasswordFormData = InferOutput<typeof RecuperarPasswordSchema>

function RecuperarPassword() {
  const [form, setForm] = useState<RecuperarPasswordFormData>({ email: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof RecuperarPasswordFormData, string>>>({})
  const [enviado, setEnviado] = useState(false)

  function handleChange(value: string) {
    setForm({ email: value })
    setErrors((prev) => {
      const next = { ...prev }
      delete next.email
      return next
    })
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const result = safeParse(RecuperarPasswordSchema, form)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RecuperarPasswordFormData, string>> = {}
      for (const issue of result.issues) {
        const key = issue.path?.[0]?.key as keyof RecuperarPasswordFormData | undefined
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setEnviado(true)
  }

  const isValid = safeParse(RecuperarPasswordSchema, form).success

  if (enviado) {
    return (
      <FormLayout backTo="/login">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-success"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Correo enviado</h1>
          <p className="text-sm text-gray-500 mb-6">
            Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.
          </p>
          <Link
            to="/login"
            className="text-primary font-medium hover:underline text-sm"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </FormLayout>
    )
  }

  return (
    <FormLayout backTo="/login">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Recuperar contraseña</h1>
      <p className="text-sm text-gray-500 mb-6">
        Ingresá tu correo electrónico y te enviaremos instrucciones para restablecerla
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="admin@gestionviajes.com"
            value={form.email}
            onChange={e => handleChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400
                       focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
          />
          {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full bg-primary text-white rounded-lg py-2.5 font-medium
                     hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Enviar instrucciones
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link to="/login" className="text-primary font-medium hover:underline">
          Volver al inicio de sesión
        </Link>
      </p>
    </FormLayout>
  )
}

export default RecuperarPassword
