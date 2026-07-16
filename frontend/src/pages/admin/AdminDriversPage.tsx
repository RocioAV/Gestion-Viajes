import type { AdminDriver } from '../../types/admin'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { deleteDriver, getDrivers, restoreDriver } from '../../services/admin.service'

const VEHICLE_STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Disponible',
  ON_TRIP: 'En viaje',
  OUT_OF_SERVICE: 'Fuera de servicio',
}

const VEHICLE_STATUS_STYLES: Record<string, string> = {
  AVAILABLE: 'bg-success/10 text-success',
  ON_TRIP: 'bg-info/10 text-info',
  OUT_OF_SERVICE: 'bg-error/10 text-error',
}

function AdminDriversPage() {
  const [drivers, setDrivers] = useState<AdminDriver[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<AdminDriver | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [restoringId, setRestoringId] = useState<number | null>(null)
  const [showDeleted, setShowDeleted] = useState(false)

  useEffect(() => {
    async function loadDrivers() {
      setLoading(true)
      try {
        const data = await getDrivers(showDeleted)
        setDrivers(data.drivers)
      }
      catch {
        toast.error('Error al cargar los choferes')
      }
      finally {
        setLoading(false)
      }
    }

    loadDrivers()

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        getDrivers(showDeleted).then(data => setDrivers(data.drivers)).catch(() => {})
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [showDeleted])

  function openDeleteModal(driver: AdminDriver) {
    setDeleteTarget(driver)
  }

  function closeDeleteModal() {
    setDeleteTarget(null)
  }

  async function handleDelete() {
    if (!deleteTarget)
      return

    setDeleting(true)
    try {
      await deleteDriver(deleteTarget.id)
      setDrivers(prev => prev.filter(d => d.id !== deleteTarget.id))
      toast.success(`Chofer ${deleteTarget.first_name} ${deleteTarget.last_name} desactivado`)
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

  async function handleRestore(driver: AdminDriver) {
    setRestoringId(driver.id)
    try {
      await restoreDriver(driver.id)
      setDrivers(prev => prev.filter(d => d.id !== driver.id))
      toast.success(`Chofer ${driver.first_name} ${driver.last_name} restaurado`)
    }
    catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado'
      toast.error(message)
    }
    finally {
      setRestoringId(null)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Choferes</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestión de choferes registrados
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
        : drivers.length === 0
          ? (
              <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                <p className="text-gray-500">No hay choferes para mostrar</p>
              </div>
            )
          : (
              <div className="space-y-3">
                {drivers.map(driver => {
                  const isDeleted = !!driver.deleted_at
                  return (
                    <div
                      key={driver.id}
                      className={`rounded-xl border bg-white p-5 shadow-sm ${
                        isDeleted ? 'border-gray-200 opacity-60' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className={`text-sm font-semibold ${isDeleted ? 'text-gray-400' : 'text-gray-900'}`}>
                              {driver.first_name}
                              {' '}
                              {driver.last_name}
                            </h3>
                            <span className={`text-xs ${isDeleted ? 'text-gray-300' : 'text-gray-400'}`}>
                              DNI:
                              {' '}
                              {driver.national_id}
                            </span>
                            {isDeleted && (
                              <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                                Desactivado
                              </span>
                            )}
                          </div>
                          <p className={`text-sm ${isDeleted ? 'text-gray-400' : 'text-gray-600'}`}>
                            Tel:
                            {' '}
                            {driver.phone}
                          </p>
                          {driver.vehicle && (
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <span>
                                {driver.vehicle.license_plate}
                                {' - '}
                                {driver.vehicle.model}
                              </span>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${VEHICLE_STATUS_STYLES[driver.vehicle.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                {VEHICLE_STATUS_LABELS[driver.vehicle.status] ?? driver.vehicle.status}
                              </span>
                            </div>
                          )}
                        </div>
                        {isDeleted
                          ? (
                              <button
                                type="button"
                                onClick={() => handleRestore(driver)}
                                disabled={restoringId === driver.id}
                                className="rounded-lg px-3 py-1.5 text-sm font-medium text-success
                                           hover:bg-success/10 disabled:opacity-50 transition-colors cursor-pointer"
                              >
                                {restoringId === driver.id ? 'Restaurando...' : 'Reactivar'}
                              </button>
                            )
                          : (
                              <button
                                type="button"
                                onClick={() => openDeleteModal(driver)}
                                className="rounded-lg px-3 py-1.5 text-sm font-medium text-error
                                           hover:bg-error/10 transition-colors cursor-pointer"
                              >
                                Desactivar
                              </button>
                            )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Desactivar chofer</h2>
            <p className="text-sm text-gray-500 mb-6">
              ¿Estás seguro de desactivar a
              {' '}
              <span className="font-medium text-gray-700">{deleteTarget.first_name} {deleteTarget.last_name}</span>
              ?
              <br />
              {deleteTarget.vehicle
                ? 'El vehículo asociado se marcará como fuera de servicio.'
                : 'El chofer no aparecerá en los listados.'}
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

export default AdminDriversPage
