import type { FormEvent } from 'react'
import type { AdminUser } from '../../types/admin'
import type { ResetPasswordFormData } from '../../validations/password'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { safeParse } from 'valibot'
import { deleteUser, getUsers, resetUserPassword, restoreUser } from '../../services/admin.service'
import { ResetPasswordSchema } from '../../validations/password'

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  OPERATOR: 'Operador',
}

const ROLE_STYLES: Record<string, string> = {
  ADMIN: 'bg-primary/10 text-primary',
  OPERATOR: 'bg-info/10 text-info',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const INITIAL_RESET_FORM: ResetPasswordFormData = {
  newPassword: '',
  confirmPassword: '',
}

function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null)
  const [resetForm, setResetForm] = useState<ResetPasswordFormData>(INITIAL_RESET_FORM)
  const [resetting, setResetting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [restoringId, setRestoringId] = useState<number | null>(null)
  const [showDeleted, setShowDeleted] = useState(false)

  useEffect(() => {
    async function loadUsers() {
      setLoading(true)
      try {
        const data = await getUsers(showDeleted)
        setUsers(data.users)
      }
      catch {
        toast.error('Error al cargar los usuarios')
      }
      finally {
        setLoading(false)
      }
    }

    loadUsers()

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        getUsers(showDeleted).then(data => setUsers(data.users)).catch(() => {})
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [showDeleted])

  function openResetModal(user: AdminUser) {
    setResetTarget(user)
    setResetForm(INITIAL_RESET_FORM)
  }

  function closeResetModal() {
    setResetTarget(null)
    setResetForm(INITIAL_RESET_FORM)
  }

  function openDeleteModal(user: AdminUser) {
    setDeleteTarget(user)
  }

  function closeDeleteModal() {
    setDeleteTarget(null)
  }

  async function handleDelete() {
    if (!deleteTarget)
      return

    setDeleting(true)
    try {
      await deleteUser(deleteTarget.id)
      setUsers(prev => prev.filter(u => u.id !== deleteTarget.id))
      toast.success(`Usuario ${deleteTarget.name} desactivado`)
      closeDeleteModal()
    }
    catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado'
      toast.error(message)
    }
    finally {
      setDeleting(false)
    }
  }

  async function handleRestore(user: AdminUser) {
    setRestoringId(user.id)
    try {
      await restoreUser(user.id)
      setUsers(prev => prev.filter(u => u.id !== user.id))
      toast.success(`Usuario ${user.name} restaurado`)
    }
    catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado'
      toast.error(message)
    }
    finally {
      setRestoringId(null)
    }
  }

  function handleResetChange(field: keyof ResetPasswordFormData, value: string) {
    setResetForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleResetSubmit(e: FormEvent) {
    e.preventDefault()
    const result = safeParse(ResetPasswordSchema, resetForm)
    if (!result.success) {
      toast.error('Validá los campos correctamente')
      return
    }
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    if (!resetTarget)
      return

    setResetting(true)
    try {
      await resetUserPassword(resetTarget.id, resetForm)
      toast.success(`Contraseña restablecida para ${resetTarget.name}`)
      closeResetModal()
    }
    catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado'
      toast.error(message)
    }
    finally {
      setResetting(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestión de usuarios del sistema
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-gray-600">Mostrar desactivados</span>
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={e => setShowDeleted(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
          </label>
        </div>
      </div>

      {loading
        ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          )
        : users.length === 0
          ? (
              <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                <p className="text-gray-500">No hay usuarios para mostrar</p>
              </div>
            )
          : (
              <div className="space-y-3">
                {users.map(user => {
                  const isDeleted = !!user.deleted_at
                  return (
                    <div
                      key={user.id}
                      className={`rounded-xl border bg-white p-5 shadow-sm ${
                        isDeleted ? 'border-gray-200 opacity-60' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className={`text-sm font-semibold ${isDeleted ? 'text-gray-400' : 'text-gray-900'}`}>{user.name}</h3>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_STYLES[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                              {ROLE_LABELS[user.role] ?? user.role}
                            </span>
                            {isDeleted && (
                              <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                                Desactivado
                              </span>
                            )}
                          </div>
                          <p className={`text-sm ${isDeleted ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {user.assigned_location && (
                              <span>{user.assigned_location}</span>
                            )}
                            <span>
                              Creado:
                              {' '}
                              {formatDate(user.created_at)}
                            </span>
                          </div>
                        </div>
                        {user.role !== 'ADMIN' && (
                          <div className="flex gap-2">
                            {isDeleted
                              ? (
                                  <button
                                    type="button"
                                    onClick={() => handleRestore(user)}
                                    disabled={restoringId === user.id}
                                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-success
                                               hover:bg-success/10 disabled:opacity-50 transition-colors cursor-pointer"
                                  >
                                    {restoringId === user.id ? 'Restaurando...' : 'Reactivar'}
                                  </button>
                                )
                              : (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => openResetModal(user)}
                                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-primary
                                                 hover:bg-primary/10 transition-colors cursor-pointer"
                                    >
                                      Restablecer
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => openDeleteModal(user)}
                                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-error
                                                 hover:bg-error/10 transition-colors cursor-pointer"
                                    >
                                      Desactivar
                                    </button>
                                  </>
                                )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

      {resetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Restablecer contraseña
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Nueva contraseña para
              {' '}
              <span className="font-medium text-gray-700">{resetTarget.name}</span>
            </p>

            <form onSubmit={handleResetSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="reset-newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nueva contraseña
                </label>
                <input
                  id="reset-newPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••"
                  value={resetForm.newPassword}
                  onChange={e => handleResetChange('newPassword', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400
                             focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="reset-confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirmar contraseña
                </label>
                <input
                  id="reset-confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••"
                  value={resetForm.confirmPassword}
                  onChange={e => handleResetChange('confirmPassword', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400
                             focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeResetModal}
                  className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700
                             hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={resetting}
                  className="flex-1 bg-primary text-white rounded-lg py-2.5 font-medium
                             hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {resetting ? 'Restableciendo...' : 'Restablecer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Desactivar usuario</h2>
            <p className="text-sm text-gray-500 mb-6">
              ¿Estás seguro de desactivar a
              {' '}
              <span className="font-medium text-gray-700">{deleteTarget.name}</span>
              ?
              <br />
              El usuario no podrá iniciar sesión ni aparecerá en los listados.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700
                           hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-error text-white rounded-lg py-2.5 font-medium
                           hover:bg-error/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {deleting ? 'Desactivando...' : 'Desactivar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPage
