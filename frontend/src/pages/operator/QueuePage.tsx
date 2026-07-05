import type { TripWithRelations } from '../../types/operator'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getUser } from '../../lib/auth'
import { addPassenger, getQueue } from '../../services/operator.service'

const INPUT_CLASS = 'w-20 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition text-center'

function formatTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} min`
  const hours = Math.floor(mins / 60)
  return `${hours}h ${mins % 60}min`
}

function QueuePage() {
  const user = getUser()
  const destination = user?.assigned_location === 'JUJUY' ? 'JUJUY' : 'SALTA'

  const [trips, setTrips] = useState<TripWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [actingId, setActingId] = useState<number | null>(null)
  const [passengerCounts, setPassengerCounts] = useState<Record<number, number>>({})

  async function loadQueue() {
    setLoading(true)
    try {
      const data = await getQueue(destination)
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
  }, [destination])

  async function handleAddPassengers(tripId: number) {
    const count = passengerCounts[tripId]
    if (!count || count < 1) {
      toast.warning('Ingresa la cantidad de pasajeros')
      return
    }

    setActingId(tripId)
    try {
      const data = await addPassenger(tripId, { count })
      if (data.trip.status === 'IN_PROGRESS') {
        setTrips(prev => prev.filter(t => t.id !== tripId))
        toast.success('Vehiculo completo! El viaje ha comenzado')
      }
      else {
        setTrips(prev =>
          prev.map(t => (t.id === tripId ? data.trip : t)),
        )
        toast.success(`Se agregaron ${count} pasajero(s)`)
      }
      setPassengerCounts(prev => ({ ...prev, [tripId]: 0 }))
    }
    catch {
      toast.error('Error al agregar pasajeros')
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
          Vehiculos en espera con destino a
          {' '}
          <span className="font-medium text-gray-700">{destination}</span>
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
                {trips.map((trip) => {
                  const isActing = actingId === trip.id
                  const remaining = trip.vehicle.passenger_capacity - trip.occupied_seats
                  const count = passengerCounts[trip.id] ?? 1

                  return (
                    <div
                      key={trip.id}
                      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-sm font-semibold text-gray-900">
                              {trip.vehicle.license_plate}
                            </h3>
                            <span className="inline-flex items-center rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning">
                              En cola
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

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            max={remaining}
                            value={count}
                            onChange={e => setPassengerCounts(prev => ({
                              ...prev,
                              [trip.id]: Number(e.target.value),
                            }))}
                            disabled={isActing}
                            className={INPUT_CLASS}
                          />
                          <button
                            type="button"
                            onClick={() => handleAddPassengers(trip.id)}
                            disabled={isActing || remaining === 0}
                            className="cursor-pointer rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isActing
                              ? '...'
                              : remaining === 0
                                ? 'Completo'
                                : 'Agregar'}
                          </button>
                        </div>
                      </div>

                      {remaining > 0 && (
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
