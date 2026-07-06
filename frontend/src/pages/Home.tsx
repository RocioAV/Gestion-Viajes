import type { NextTripResponse, TripWithRelations } from '../types/operator'
import { useEffect, useState } from 'react'
import { getNextTrips } from '../services/public.service'

const locations = [
  { key: 'JUJUY', label: 'Desde Jujuy', emoji: '🏔️' },
  { key: 'SALTA', label: 'Desde Salta', emoji: '🏛️' },
] as const

function TripCard({ trip }: { trip: TripWithRelations }) {
  return (
    <div className="rounded-xl border border-primary/20 bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <span className="text-xl">🚐</span>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-800">
            {trip.vehicle.model}
          </p>
          <p className="text-sm text-gray-500">
            {trip.vehicle.license_plate}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
          <span className="text-sm text-gray-600">Conductor</span>
          <span className="font-medium text-gray-800">
            {trip.vehicle.driver.first_name}
            {' '}
            {trip.vehicle.driver.last_name}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
          <span className="text-sm text-gray-600">Pasajeros</span>
          <span className="font-medium text-gray-800">
            {trip.occupied_seats}
            {' / '}
            {trip.vehicle.passenger_capacity}
          </span>
        </div>
      </div>
    </div>
  )
}

function Home() {
  const [data, setData] = useState<NextTripResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'JUJUY' | 'SALTA'>('JUJUY')

  useEffect(() => {
    getNextTrips()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const currentTrip = activeTab === 'JUJUY' ? data?.jujuy : data?.salta

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-primary text-3xl font-bold">Próximos viajes</h1>
        <p className="mt-1 text-sm text-gray-500">
          Seleccioná tu origen para ver el próximo viaje disponible
        </p>
      </div>

      <div className="mb-6 flex gap-2 rounded-xl bg-gray-100 p-1.5">
        {locations.map(loc => (
          <button
            key={loc.key}
            onClick={() => setActiveTab(loc.key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === loc.key
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{loc.emoji}</span>
            {loc.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="space-y-4">
          <div className="h-48 animate-pulse rounded-xl bg-gray-200" />
        </div>
      )}

      {!loading && currentTrip && (
        <TripCard trip={currentTrip} />
      )}

      {!loading && !currentTrip && (
        <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
          <p className="mb-2 text-4xl">🕐</p>
          <p className="text-lg font-medium text-gray-600">
            No hay viajes programados
          </p>
          <p className="mt-1 text-sm text-gray-400">
            {activeTab === 'JUJUY'
              ? 'Desde Jujuy'
              : 'Desde Salta'}
            {' '}
            no tiene vehículos en cola en este momento
          </p>
        </div>
      )}
    </div>
  )
}

export default Home
