import type { TripWithRelations } from '../../types/operator'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getUser } from '../../lib/auth'
import { addPassenger, getQueue, removePassenger } from '../../services/operator.service'

function formatTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} min`
  const hours = Math.floor(mins / 60)
  return `${hours}h ${mins % 60}min`
}

function QueuePage() {
  const user = getUser()
  const origin = user?.assigned_location === 'JUJUY' ? 'JUJUY' : 'SALTA'

  const [trips, setTrips] = useState<TripWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [actingId, setActingId] = useState<number | null>(null)

  async function loadQueue() {
    setLoading(true)
    try {
      const data = await getQueue(origin)
      setTrips(data.trips)
    }
    catch {
      toast.error('Error al cargar la cola')
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQueue()
  }, [origin])

  async function handleAddPassenger(tripId: number) {
    setActingId(tripId)
    try {
      const data = await addPassenger(tripId, { count: 1 })
      if (data.trip.status === 'IN_PROGRESS') {
        setTrips(prev => prev.filter(t => t.id !== tripId))
        toast.success('Vehiculo completo! El viaje ha comenzado')
      }
      else {
        setTrips(prev =>
          prev.map(t => (t.id === tripId ? data.trip : t)),
        )
        toast.success('Se agrego 1 pasajero')
      }
    }
    catch {
      toast.error('Error al agregar pasajero')
    }
    finally {
      setActingId(null)
    }
  }

  async function handleRemovePassenger(tripId: number) {
    setActingId(tripId)
    try {
      const data = await removePassenger(tripId, { count: 1 })
      setTrips(prev =>
        prev.map(t => (t.id === tripId ? data.trip : t)),
      )
      toast.success('Se quito 1 pasajero')
    }
    catch {
      toast.error('Error al quitar pasajero')
    }
    finally {
      setActingId(null)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Cola de Vehiculos</h1>
        <p className="mt-1 text-sm text-gray-500">
          Vehiculos en espera para salir desde
          {' '}
          <span className="font-medium text-gray-700">{origin}</span>
        </p>
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
                <p className="text-gray-500">No hay vehiculos en cola</p>
                <p className="mt-1 text-sm text-gray-400">
                  Ingresa un vehiculo desde la seccion &quot;Ingresar a Cola&quot;
                </p>
              </div>
            )
          : (
              <div className="space-y-3">
                {trips.map((trip, index) => {
                  const isFirst = index === 0
                  const isActing = actingId === trip.id
                  const remaining = trip.vehicle.passenger_capacity - trip.occupied_seats

                  return (
                    <div
                      key={trip.id}
                      className={`rounded-xl border bg-white p-5 shadow-sm ${
                        isFirst ? 'border-primary/30 ring-1 ring-primary/20' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-sm font-semibold text-gray-900">
                              {trip.vehicle.license_plate}
                            </h3>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              isFirst ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {isFirst ? 'En cola (primero)' : 'En espera'}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatTime(trip.departure_at)}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600">
                            {trip.vehicle.model}
                            {' - '}
                            {trip.vehicle.driver.first_name}
                            {' '}
                            {trip.vehicle.driver.last_name}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                              {trip.origin}
                              {' -> '}
                              {trip.destination}
                            </span>
                            <span>
                              $
                              {trip.price_per_passenger}
                              /pax
                            </span>
                          </div>

                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">Asientos:</span>
                              <div className="h-2 w-40 overflow-hidden rounded-full bg-gray-200">
                                <div
                                  className="h-full rounded-full bg-primary transition-all"
                                  style={{ width: `${(trip.occupied_seats / trip.vehicle.passenger_capacity) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                {trip.occupied_seats}
                                /
                                {trip.vehicle.passenger_capacity}
                              </span>
                            </div>
                          </div>
                        </div>

                        {isFirst && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleRemovePassenger(trip.id)}
                              disabled={isActing || trip.occupied_seats === 0}
                              className="cursor-pointer rounded-lg bg-error/10 px-4 py-2 text-sm font-medium text-error transition-colors hover:bg-error/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isActing ? '...' : 'Remover'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddPassenger(trip.id)}
                              disabled={isActing || remaining === 0}
                              className="cursor-pointer rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-success transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isActing
                                ? '...'
                                : remaining === 0
                                  ? 'Completo'
                                  : 'Agregar'}
                            </button>
                          </div>
                        )}
                      </div>

                      {isFirst && remaining > 0 && (
                        <p className="mt-2 text-xs text-gray-400">
                          {remaining === 1
                            ? 'Falta 1 asiento para completar'
                            : `Faltan ${remaining} asientos para completar`}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
    </div>
  )
}

export default QueuePage
