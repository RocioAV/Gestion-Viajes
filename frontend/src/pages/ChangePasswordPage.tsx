import type { FormEvent } from 'react'
import type { ChangePasswordFormData } from '../validations/password'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { safeParse } from 'valibot'
import { changePassword } from '../services/auth.service'
import { ChangePasswordSchema } from '../validations/password'

type FieldErrors = Partial<Record<keyof ChangePasswordFormData, string>>

function getFieldErrors(data: ChangePasswordFormData): FieldErrors {
  const result = safeParse(ChangePasswordSchema, data)
  const fieldErrors: FieldErrors = {}
  if (!result.success) {
    for (const issue of result.issues) {
      const key = issue.path?.[0]?.key as keyof ChangePasswordFormData | undefined
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message
      }
    }
  }
  if (data.newPassword && data.confirmPassword && data.newPassword !== data.confirmPassword) {
    fieldErrors.confirmPassword = 'Las contraseñas no coinciden'
  }
  return fieldErrors
}

const INITIAL_FORM: ChangePasswordFormData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

function ChangePasswordPage() {
  const [form, setForm] = useState<ChangePasswordFormData>(INITIAL_FORM)
  const [loading, setLoading] = useState(false)

  const fieldErrors = getFieldErrors(form)
  const isValid = Object.keys(fieldErrors).length === 0

  function handleChange(field: keyof ChangePasswordFormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function resetForm() {
    setForm(INITIAL_FORM)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!isValid)
      return

    setLoading(true)

    try {
      await changePassword(form)
      toast.success('Contraseña actualizada correctamente')
      resetForm()
    }
    catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado'
      toast.error(message)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Cambiar contraseña</h1>
        <p className="mt-1 text-sm text-gray-500">
          Ingresá tu contraseña actual y la nueva contraseña
        </p>
      </div>

      <div className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
              Contraseña actual
            </label>
            <input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              placeholder="••••••"
              value={form.currentPassword}
              onChange={e => handleChange('currentPassword', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400
                         focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            />
            {fieldErrors.currentPassword && (
              <p className="text-error text-sm mt-1">{fieldErrors.currentPassword}</p>
            )}
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
              Nueva contraseña
            </label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••"
              value={form.newPassword}
              onChange={e => handleChange('newPassword', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400
                         focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            />
            {fieldErrors.newPassword && (
              <p className="text-error text-sm mt-1">{fieldErrors.newPassword}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirmar nueva contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••"
              value={form.confirmPassword}
              onChange={e => handleChange('confirmPassword', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400
                         focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            />
            {fieldErrors.confirmPassword && (
              <p className="text-error text-sm mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full bg-primary text-white rounded-lg py-2.5 font-medium
                       hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {loading ? 'Actualizando...' : 'Actualizar contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChangePasswordPage
