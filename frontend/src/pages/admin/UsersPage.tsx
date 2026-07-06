import type { AdminUser } from '../../types/admin'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getUsers } from '../../services/admin.service'

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

function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUsers() {
      setLoading(true)
      try {
        const data = await getUsers()
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
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestión de usuarios del sistema
        </p>
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
                {users.map(user => (
                  <div
                    key={user.id}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-semibold text-gray-900">{user.name}</h3>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_STYLES[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                          {ROLE_LABELS[user.role] ?? user.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
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
                  </div>
                ))}
              </div>
            )}
    </div>
  )
}

export default UsersPage
