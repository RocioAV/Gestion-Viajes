import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { safeParse } from 'valibot'
import FormLayout from '../components/FormLayout'
import { LoginSchema, type LoginFormData } from '../validations/auth'

function Login() {
  const [form, setForm] = useState<LoginFormData>({ email: '', password: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({})

  function handleChange(field: keyof LoginFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const result = safeParse(LoginSchema, form)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {}
      for (const issue of result.issues) {
        const key = issue.path?.[0]?.key as keyof LoginFormData | undefined
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    console.log('Login:', result.output)
  }

  const isValid = safeParse(LoginSchema, form).success

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
            placeholder="admin@gestionviajes.com"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400
                       focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
          />
          {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
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
            onChange={(e) => handleChange('password', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400
                       focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
          />
          {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full bg-primary text-white rounded-lg py-2.5 font-medium
                     hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Iniciar sesión
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
