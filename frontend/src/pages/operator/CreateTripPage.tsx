import type { FormEvent } from 'react'
import type { Vehicle } from '../../types/operator'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getUser } from '../../lib/auth'
import { createTrip, getAvailableVehicles } from '../../services/operator.service'

const INPUT_CLASS = 'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition'
const SELECT_CLASS = 'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition bg-white cursor-pointer'

function CreateTripPage() {
  const navigate = useNavigate()
  const user = getUser()
  const origin = user?.assigned_location === 'JUJUY' ? 'JUJUY' : 'SALTA'
  const destination = origin === 'JUJUY' ? 'SALTA' : 'JUJUY'

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [vehicleId, setVehicleId] = useState<number>(0)
  const [occupiedSeats, setOccupiedSeats] = useState<number>(1)

  const selectedVehicle = vehicles.find(v => v.id === vehicleId)
  const maxSeats = selectedVehicle?.passenger_capacity ?? 1

  useEffect(() => {
    async function loadVehicles() {
      try {
        const data = await getAvailableVehicles(origin)
        setVehicles(data.vehicles)
      }
      catch {
        toast.error('Error al cargar los vehiculos disponibles')
      }
      finally {
        setLoading(false)
      }
    }

    loadVehicles()
  }, [origin])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!vehicleId) {
      toast.warning('Selecciona un vehiculo')
      return
    }

    if (occupiedSeats < 1) {
      toast.warning('Debe haber al menos 1 asiento ocupado')
      return
    }

    setSubmitting(true)
    try {
      await createTrip({ vehicle_id: vehicleId, occupied_seats: occupiedSeats })
      toast.success('Viaje creado exitosamente')
      navigate('/operador/viajes')
    }
    catch {
      toast.error('Error al crear el viaje')
    }
    finally {
      setSubmitting(false)
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
        <h1 className="text-2xl font-bold text-gray-900">Crear Viaje</h1>
        <p className="mt-1 text-sm text-gray-500">
          Selecciona un vehiculo y la cantidad de pasajeros
        </p>
      </div>

      <div className="mx-auto max-w-lg">
        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-5">
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Origen</span>
                <span className="font-medium text-gray-900">{origin}</span>
              </div>
              <div className="my-2 border-t border-gray-200" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Destino</span>
                <span className="font-medium text-gray-900">{destination}</span>
              </div>
            </div>

            <div>
              <label htmlFor="vehicle" className="mb-1.5 block text-sm font-medium text-gray-700">
                Vehiculo
              </label>
              {vehicles.length === 0
                ? (
                    <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
                      No hay vehiculos disponibles en esta ubicacion
                    </p>
                  )
                : (
                    <select
                      id="vehicle"
                      value={vehicleId || ''}
                      onChange={(e) => {
                        setVehicleId(Number(e.target.value))
                        setOccupiedSeats(1)
                      }}
                      className={SELECT_CLASS}
                    >
                      <option value="" disabled>Seleccionar vehiculo</option>
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.license_plate}
                          {' - '}
                          {v.model}
                          {' ('}
                          {v.passenger_capacity}
                          {' asientos)'}
                        </option>
                      ))}
                    </select>
                  )}
            </div>

            <div>
              <label htmlFor="seats" className="mb-1.5 block text-sm font-medium text-gray-700">
                Asientos ocupados
              </label>
              <input
                id="seats"
                type="number"
                min={1}
                max={maxSeats}
                value={occupiedSeats}
                onChange={e => setOccupiedSeats(Number(e.target.value))}
                disabled={!vehicleId}
                className={vehicleId ? INPUT_CLASS : `${INPUT_CLASS} bg-gray-50 cursor-not-allowed`}
              />
              {selectedVehicle && (
                <p className="mt-1 text-xs text-gray-500">
                  Maximo:
                  {' '}
                  {selectedVehicle.passenger_capacity}
                  {' '}
                  asientos
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!vehicleId || submitting}
            className="mt-6 w-full cursor-pointer rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Creando viaje...' : 'Crear viaje'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateTripPage
