import type { AdminDriver } from '../../types/admin'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getDrivers } from '../../services/admin.service'

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

  useEffect(() => {
    async function loadDrivers() {
      setLoading(true)
      try {
        const data = await getDrivers()
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
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Choferes</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestión de choferes registrados
        </p>
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
                {drivers.map(driver => (
                  <div
                    key={driver.id}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {driver.first_name}
                          {' '}
                          {driver.last_name}
                        </h3>
                        <span className="text-xs text-gray-400">
                          DNI:
                          {' '}
                          {driver.national_id}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
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
                  </div>
                ))}
              </div>
            )}
    </div>
  )
}

export default AdminDriversPage
