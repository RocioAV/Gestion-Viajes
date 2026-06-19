import type { FormEvent } from 'react'
import type { RegistroFormData } from '../../validations/auth'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { safeParse } from 'valibot'
import FormLayout from '../../components/FormLayout'
import { RegistroSchema } from '../../validations/auth'

const LOCATIONES = ['JUJUY', 'SALTA'] as const

function Registro() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    assigned_location: '' as '' | 'JUJUY' | 'SALTA',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof RegistroFormData, string>>>({})

  function handleChange(field: keyof RegistroFormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const result = safeParse(RegistroSchema, form)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegistroFormData, string>> = {}
      for (const issue of result.issues) {
        const key = issue.path?.[0]?.key as keyof RegistroFormData | undefined
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }
    setErrors({})
  }

  const isValid = safeParse(RegistroSchema, form).success

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
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400
                       focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
          />
          {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
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
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400
                       focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
          />
          {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
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
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400
                       focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
          />
          {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1.5">
            Sede asignada
          </label>
          <select
            id="location"
            value={form.assigned_location}
            onChange={e => handleChange('assigned_location', e.target.value)}
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
          {errors.assigned_location && (
            <p className="text-error text-sm mt-1">{errors.assigned_location}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full bg-primary text-white rounded-lg py-2.5 font-medium
                     hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Registrar operador
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
