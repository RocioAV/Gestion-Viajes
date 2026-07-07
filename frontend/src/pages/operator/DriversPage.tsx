import type { DriverWithVehicle } from '../../types/operator'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getDrivers, toggleDriverAvailability } from '../../services/operator.service'

function DriversPage() {
  const [drivers, setDrivers] = useState<DriverWithVehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  useEffect(() => {
    loadDrivers()

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        loadDrivers()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  async function loadDrivers() {
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

  async function handleToggle(driver: DriverWithVehicle) {
    if (!driver.vehicle) {
      toast.warning('Este chofer no tiene vehiculo asignado')
      return
    }

    setTogglingId(driver.id)
    try {
      const data = await toggleDriverAvailability(driver.id)
      setDrivers(prev =>
        prev.map(d => (d.id === driver.id ? data.driver : d)),
      )
      toast.success(data.message)
    }
    catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cambiar disponibilidad'
      if (message === 'Chofer no encontrado') {
        setDrivers(prev => prev.filter(d => d.id !== driver.id))
        toast.info('El chofer fue desactivado del sistema')
      }
      else {
        toast.error(message)
      }
    }
    finally {
      setTogglingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Choferes</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestionar disponibilidad de los choferes
        </p>
      </div>

      {drivers.length === 0
        ? (
            <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
              <p className="text-gray-500">No hay choferes registrados</p>
            </div>
          )
        : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {drivers.map((driver) => {
                const vehicle = driver.vehicle
                const isAvailable = vehicle?.status === 'AVAILABLE'
                const hasVehicle = !!vehicle
                const isToggling = togglingId === driver.id

                return (
                  <div
                    key={driver.id}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">
                          {driver.first_name}
                          {' '}
                          {driver.last_name}
                        </h3>
                        <p className="mt-0.5 text-sm text-gray-500">
                          DNI:
                          {driver.national_id}
                        </p>
                      </div>
                      {hasVehicle
                        ? (
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                isAvailable
                                  ? 'bg-success/10 text-success'
                                  : 'bg-error/10 text-error'
                              }`}
                            >
                              {isAvailable ? 'Disponible' : 'No disponible'}
                            </span>
                          )
                        : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                              Sin vehiculo
                            </span>
                          )}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-gray-400">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        {driver.phone}
                      </div>
                      {vehicle
                        && (
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-gray-400">
                              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                              <circle cx="7" cy="17" r="2" />
                              <path d="M9 17h6" />
                              <circle cx="17" cy="17" r="2" />
                            </svg>
                            {vehicle.license_plate}
                            {' - '}
                            {vehicle.model}
                          </div>
                        )}
                    </div>

                    {hasVehicle
                      && (
                        <button
                          type="button"
                          onClick={() => handleToggle(driver)}
                          disabled={isToggling}
                          className={`mt-4 w-full rounded-lg py-2.5 text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                            isAvailable
                              ? 'bg-error/10 text-error hover:bg-error/20'
                              : 'bg-success/10 text-success hover:bg-success/20'
                          }`}
                        >
                          {isToggling
                            ? 'Cambiando...'
                            : isAvailable
                              ? 'Desactivar disponibilidad'
                              : 'Activar disponibilidad'}
                        </button>
                      )}
                  </div>
                )
              })}
            </div>
          )}
    </div>
  )
}

export default DriversPage
