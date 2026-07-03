import type { TripFilters, TripWithRelations } from '../../types/operator'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { cancelTrip, completeTrip, getTrips } from '../../services/operator.service'

const SELECT_CLASS = 'border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition bg-white cursor-pointer'
const INPUT_CLASS = 'border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition'

const STATUS_LABELS: Record<string, string> = {
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
}

const STATUS_STYLES: Record<string, string> = {
  IN_PROGRESS: 'bg-warning/10 text-warning',
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
  const [actingId, setActingId] = useState<number | null>(null)

  const [filters, setFilters] = useState<TripFilters>({})

  useEffect(() => {
    async function loadTrips() {
      setLoading(true)
      try {
        const data = await getTrips(filters)
        setTrips(data.trips)
      }
      catch {
        toast.error('Error al cargar los viajes')
      }
      finally {
        setLoading(false)
      }
    }

    loadTrips()
  }, [filters])

  async function handleComplete(tripId: number) {
    setActingId(tripId)
    try {
      const data = await completeTrip(tripId)
      setTrips(prev =>
        prev.map(t => (t.id === tripId ? data.trip : t)),
      )
      toast.success(data.message)
    }
    catch {
      toast.error('Error al completar el viaje')
    }
    finally {
      setActingId(null)
    }
  }

  async function handleCancel(tripId: number) {
    setActingId(tripId)
    try {
      const data = await cancelTrip(tripId)
      setTrips(prev =>
        prev.map(t => (t.id === tripId ? data.trip : t)),
      )
      toast.success(data.message)
    }
    catch {
      toast.error('Error al cancelar el viaje')
    }
    finally {
      setActingId(null)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Viajes</h1>
        <p className="mt-1 text-sm text-gray-500">
          Historial y estado de los viajes
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={filters.status ?? ''}
          onChange={e => setFilters(prev => ({
            ...prev,
            status: (e.target.value || undefined) as TripFilters['status'],
          }))}
          className={SELECT_CLASS}
        >
          <option value="">Todos los estados</option>
          <option value="IN_PROGRESS">En progreso</option>
          <option value="COMPLETED">Completado</option>
          <option value="CANCELLED">Cancelado</option>
        </select>

        <div className="flex items-center gap-2">
          <label htmlFor="date-from" className="text-sm text-gray-500">Desde</label>
          <input
            id="date-from"
            type="date"
            value={filters.date_from ?? ''}
            onChange={e => setFilters(prev => ({
              ...prev,
              date_from: e.target.value || undefined,
            }))}
            className={INPUT_CLASS}
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="date-to" className="text-sm text-gray-500">Hasta</label>
          <input
            id="date-to"
            type="date"
            value={filters.date_to ?? ''}
            onChange={e => setFilters(prev => ({
              ...prev,
              date_to: e.target.value || undefined,
            }))}
            className={INPUT_CLASS}
          />
        </div>
      </div>

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
                {trips.map((trip) => {
                  const isActing = actingId === trip.id
                  const isActive = trip.status === 'IN_PROGRESS'

                  return (
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

                        {isActive
                          && (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleComplete(trip.id)}
                                disabled={isActing}
                                className="cursor-pointer rounded-lg bg-success/10 px-4 py-2 text-sm font-medium text-success transition-colors hover:bg-success/20 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isActing ? '...' : 'Completar'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCancel(trip.id)}
                                disabled={isActing}
                                className="cursor-pointer rounded-lg bg-error/10 px-4 py-2 text-sm font-medium text-error transition-colors hover:bg-error/20 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isActing ? '...' : 'Cancelar'}
                              </button>
                            </div>
                          )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
    </div>
  )
}

export default TripsPage
