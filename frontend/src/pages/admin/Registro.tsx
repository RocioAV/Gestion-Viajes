import type { FormEvent } from 'react'
import type { RegistroFormData } from '../../validations/auth'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { safeParse } from 'valibot'
import FormLayout from '../../components/FormLayout'
import { registerUser } from '../../services/auth.service'
import { RegistroSchema } from '../../validations/auth'

const LOCATIONES = ['JUJUY', 'SALTA'] as const

type FieldErrors = Partial<Record<keyof RegistroFormData, string>>
type TouchedFields = Partial<Record<keyof RegistroFormData, boolean>>

function getFieldErrors(data: RegistroFormData): FieldErrors {
  const result = safeParse(RegistroSchema, data)
  const fieldErrors: FieldErrors = {}
  if (!result.success) {
    for (const issue of result.issues) {
      const key = issue.path?.[0]?.key as keyof RegistroFormData | undefined
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message
      }
    }
  }
  if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
    fieldErrors.confirmPassword = 'Las contraseñas no coinciden'
  }
  return fieldErrors
}

const INITIAL_FORM: RegistroFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  assigned_location: '' as RegistroFormData['assigned_location'],
}

function Registro() {
  const [form, setForm] = useState<RegistroFormData>(INITIAL_FORM)
  const [touched, setTouched] = useState<TouchedFields>({})
  const [loading, setLoading] = useState(false)

  const fieldErrors = getFieldErrors(form)
  const isValid = Object.keys(fieldErrors).length === 0

  function handleChange(field: keyof RegistroFormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleBlur(field: keyof RegistroFormData) {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  function resetForm() {
    setForm(INITIAL_FORM)
    setTouched({})
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched({ name: true, email: true, password: true, confirmPassword: true, assigned_location: true })

    if (!isValid)
      return

    setLoading(true)

    try {
      const { confirmPassword: _, ...apiData } = form
      await registerUser(apiData)
      toast.success('Operador registrado correctamente')
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
    <FormLayout backTo="/login">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Registro de Operadores</h1>
      <p className="text-sm text-gray-500 mb-6">
        Completá los datos para crear un nuevo operador
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Nombre completo
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Juan Pérez"
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400
                       focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
          />
          {touched.name && fieldErrors.name && (
            <p className="text-error text-sm mt-1">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Correo electrónico
          </label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            placeholder="operador@ejemplo.com"
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
          <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1.5">
            Contraseña
          </label>
          <input
            id="reg-password"
            type="password"
            autoComplete="new-password"
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

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirmar contraseña
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••"
            value={form.confirmPassword}
            onChange={e => handleChange('confirmPassword', e.target.value)}
            onBlur={() => handleBlur('confirmPassword')}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400
                       focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
          />
          {touched.confirmPassword && fieldErrors.confirmPassword && (
            <p className="text-error text-sm mt-1">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1.5">
            Sede asignada
          </label>
          <select
            id="location"
            value={form.assigned_location}
            onChange={e => handleChange('assigned_location', e.target.value)}
            onBlur={() => handleBlur('assigned_location')}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900
                       focus:ring-2 focus:ring-primary focus:border-primary outline-none transition
                       bg-white cursor-pointer"
          >
            <option value="" disabled>
              Seleccionar sede
            </option>
            {LOCATIONES.map(loc => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          {touched.assigned_location && fieldErrors.assigned_location && (
            <p className="text-error text-sm mt-1">{fieldErrors.assigned_location}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full bg-primary text-white rounded-lg py-2.5 font-medium
                     hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {loading ? 'Registrando...' : 'Registrar operador'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        ¿Ya tenés cuenta?
        {' '}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Inicia sesión
        </Link>
      </p>
    </FormLayout>
  )
}

export default Registro
