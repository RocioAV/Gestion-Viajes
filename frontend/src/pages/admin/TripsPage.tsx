import type { AdminTripFilters } from '../../types/admin'
import type { TripWithRelations } from '../../types/operator'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { exportTrips, getTrips } from '../../services/admin.service'

const SELECT_CLASS = 'border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition bg-white cursor-pointer'
const INPUT_CLASS = 'border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition'

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En cola',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-warning/10 text-warning',
  IN_PROGRESS: 'bg-info/10 text-info',
  COMPLETED: 'bg-success/10 text-success',
  CANCELLED: 'bg-error/10 text-error',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function TripsPage() {
  const [trips, setTrips] = useState<TripWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [filters, setFilters] = useState<AdminTripFilters>({})

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '')

  useEffect(() => {
    async function loadTrips() {
      setLoading(true)
      try {
        const data = await getTrips(filters)
        const result = hasActiveFilters ? data.trips : data.trips.slice(0, 10)
        setTrips(result)
      }
      catch {
        toast.error('Error al cargar los viajes')
      }
      finally {
        setLoading(false)
      }
    }

    loadTrips()
  }, [filters, hasActiveFilters])

  function handleFilterChange<K extends keyof AdminTripFilters>(key: K, value: AdminTripFilters[K]) {
    setFilters(prev => ({ ...prev, [key]: value || undefined }))
  }

  function clearFilters() {
    setFilters({})
  }

  async function handleExport() {
    if (!hasActiveFilters) {
      toast.warning('Seleccioná al menos un filtro para exportar')
      return
    }

    setExporting(true)
    try {
      await exportTrips(filters)
      toast.success('Excel descargado correctamente')
    }
    catch {
      toast.error('Error al exportar viajes')
    }
    finally {
      setExporting(false)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Viajes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Historial y estado de todos los viajes
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting || loading}
          className="flex items-center gap-2 rounded-lg bg-success/10 px-4 py-2.5 text-sm font-medium text-success transition-colors hover:bg-success/20 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          {exporting ? 'Exportando...' : 'Exportar Excel'}
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={filters.status ?? ''}
          onChange={e => handleFilterChange('status', (e.target.value || undefined) as AdminTripFilters['status'])}
          className={SELECT_CLASS}
        >
          <option value="">Todos los estados</option>
          <option value="PENDING">En cola</option>
          <option value="IN_PROGRESS">En progreso</option>
          <option value="COMPLETED">Completado</option>
          <option value="CANCELLED">Cancelado</option>
        </select>

        <select
          value={filters.origin ?? ''}
          onChange={e => handleFilterChange('origin', (e.target.value || undefined) as AdminTripFilters['origin'])}
          className={SELECT_CLASS}
        >
          <option value="">Todos los orígenes</option>
          <option value="JUJUY">Jujuy</option>
          <option value="SALTA">Salta</option>
        </select>

        <select
          value={filters.destination ?? ''}
          onChange={e => handleFilterChange('destination', (e.target.value || undefined) as AdminTripFilters['destination'])}
          className={SELECT_CLASS}
        >
          <option value="">Todos los destinos</option>
          <option value="JUJUY">Jujuy</option>
          <option value="SALTA">Salta</option>
        </select>

        <div className="flex items-center gap-2">
          <label htmlFor="admin-date-from" className="text-sm text-gray-500">Desde</label>
          <input
            id="admin-date-from"
            type="date"
            value={filters.date_from ?? ''}
            onChange={e => handleFilterChange('date_from', e.target.value || undefined)}
            className={INPUT_CLASS}
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="admin-date-to" className="text-sm text-gray-500">Hasta</label>
          <input
            id="admin-date-to"
            type="date"
            value={filters.date_to ?? ''}
            onChange={e => handleFilterChange('date_to', e.target.value || undefined)}
            className={INPUT_CLASS}
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Contenido */}
      {loading
        ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          )
        : trips.length === 0
          ? (
              <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                <p className="text-gray-500">No hay viajes para mostrar</p>
              </div>
            )
          : (
              <div className="space-y-3">
                {trips.map(trip => (
                  <div
                    key={trip.id}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-sm font-semibold text-gray-900">
                            #
                            {trip.id}
                          </h3>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[trip.status]}`}>
                            {STATUS_LABELS[trip.status]}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600">
                          {trip.vehicle.license_plate}
                          {' - '}
                          {trip.vehicle.model}
                          {' ('}
                          {trip.vehicle.driver.first_name}
                          {' '}
                          {trip.vehicle.driver.last_name}
                          )
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            {trip.origin}
                            {' -> '}
                            {trip.destination}
                          </span>
                          <span>
                            {trip.occupied_seats}
                            {' asientos'}
                          </span>
                          <span>
                            $
                            {trip.price_per_passenger}
                            /pax
                          </span>
                        </div>

                        <p className="text-xs text-gray-400">
                          {formatDate(trip.departure_at)}
                          {trip.arrival_at && ` - ${formatDate(trip.arrival_at)}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
    </div>
  )
}

export default TripsPage
