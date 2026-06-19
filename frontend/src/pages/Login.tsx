import type { FormEvent } from 'react'
import type { LoginFormData } from '../validations/auth'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { safeParse } from 'valibot'
import FormLayout from '../components/FormLayout'
import { loginUser } from '../services/auth.service'
import { LoginSchema } from '../validations/auth'

type FieldErrors = Partial<Record<keyof LoginFormData, string>>
type TouchedFields = Partial<Record<keyof LoginFormData, boolean>>

function getFieldErrors(data: LoginFormData): FieldErrors {
  const result = safeParse(LoginSchema, data)
  if (result.success)
    return {}
  const fieldErrors: FieldErrors = {}
  for (const issue of result.issues) {
    const key = issue.path?.[0]?.key as keyof LoginFormData | undefined
    if (key && !fieldErrors[key]) {
      fieldErrors[key] = issue.message
    }
  }
  return fieldErrors
}

const INITIAL_FORM: LoginFormData = { email: '', password: '' }

function Login() {
  const [form, setForm] = useState<LoginFormData>(INITIAL_FORM)
  const [touched, setTouched] = useState<TouchedFields>({})
  const [loading, setLoading] = useState(false)

  const fieldErrors = getFieldErrors(form)
  const isValid = Object.keys(fieldErrors).length === 0

  function handleChange(field: keyof LoginFormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleBlur(field: keyof LoginFormData) {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  function resetForm() {
    setForm(INITIAL_FORM)
    setTouched({})
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched({ email: true, password: true })

    if (!isValid)
      return

    setLoading(true)

    try {
      await loginUser(form)
      toast.success('Inicio de sesión exitoso')
    }
    catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado'
      toast.error(message)
    }
    finally {
      setLoading(false)
      resetForm()
    }
  }

  return (
    <FormLayout backTo="/">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Iniciar sesión</h1>
      <p className="text-sm text-gray-500 mb-6">
        Ingresá tus credenciales para acceder a Gestión de Viajes
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
            placeholder="juan@correo.com"
            value={form.email}
            onChange={e => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400
                       focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
          />
          {touched.email && fieldErrors.email && (
            <p className="text-error text-sm mt-1">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••"
            value={form.password}
            onChange={e => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400
                       focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
          />
          {touched.password && fieldErrors.password && (
            <p className="text-error text-sm mt-1">{fieldErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full bg-primary text-white rounded-lg py-2.5 font-medium
                     hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link to="/recuperar-password" className="text-primary font-medium hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </p>
    </FormLayout>
  )
}

export default Login
