import type { NextTripResponse, TripWithRelations } from '../types/operator'
import { useEffect, useState } from 'react'
import { getNextTrips } from '../services/public.service'

const locations = [
  { key: 'JUJUY', label: 'Desde Jujuy', emoji: '🏔️' },
  { key: 'SALTA', label: 'Desde Salta', emoji: '🏛️' },
] as const

function TripCard({ trip }: { trip: TripWithRelations }) {
  return (
    <div className="rounded-xl border border-primary/20 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-secondary/10">
          <span className="text-xl">🚐</span>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-800">{trip.vehicle.model}</p>
          <p className="text-sm text-gray-500">{trip.vehicle.license_plate}</p>
        </div>
      </div>
      <div className="space-y-2">
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

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0 text-primary">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0 text-primary">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0 text-primary">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 7L2 7" />
    </svg>
  )
}

function Home() {
  const [data, setData] = useState<NextTripResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'JUJUY' | 'SALTA'>('JUJUY')

  useEffect(() => {
    getNextTrips()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const currentTrip = activeTab === 'JUJUY' ? data?.jujuy : data?.salta

  return (
    <div>
      <section className="px-4 py-20 text-center md:py-28">
        <div className="animate-fade-in-up">
          <h1 className="animate-gradient bg-gradient-to-r from-indigo-600 via-primary to-cyan-400 bg-[length:200%_auto] bg-clip-text text-5xl font-black tracking-tight text-transparent drop-shadow-lg md:text-6xl">
            CONEFA
          </h1>
          <p className="animate-gradient-subtle mt-3 bg-gradient-to-r from-gray-600 to-gray-400 bg-[length:200%_auto] bg-clip-text text-lg font-medium tracking-wide text-transparent md:text-xl">
            Tu viaje, nuestra prioridad
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 pb-20">
        <h2 className="mb-2 text-center text-2xl font-semibold text-gray-800">
          Próximos viajes
        </h2>
        <p className="mb-6 text-center text-sm text-gray-500">
          Seleccioná tu origen para ver el próximo viaje disponible
        </p>

        <div className="mb-6 flex gap-2 rounded-xl bg-gray-100 p-1.5">
          {locations.map(loc => (
            <button
              key={loc.key}
              onClick={() => setActiveTab(loc.key)}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
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
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="mb-2 text-4xl">🕐</p>
            <p className="text-lg font-medium text-gray-600">No hay viajes programados</p>
            <p className="mt-1 text-sm text-gray-400">
              {activeTab === 'JUJUY' ? 'Desde Jujuy' : 'Desde Salta'}
              {' '}
              no tiene vehículos en cola en este momento
            </p>
          </div>
        )}
      </section>

      <section className="bg-primary/5 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-semibold text-gray-800">
            Contacto y ubicación
          </h2>

          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            <div className="rounded-xl border border-primary/10 bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-lg font-semibold text-gray-800">Información</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <MapPinIcon />
                  <div>
                    <p className="font-medium text-gray-800">Dirección</p>
                    <p className="text-sm text-gray-600">
                      Lisandro de la Torre 898
                      <br />
                      San Salvador de Jujuy, Jujuy
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PhoneIcon />
                  <div>
                    <p className="font-medium text-gray-800">Teléfono</p>
                    <p className="text-sm text-gray-600">+54 388 456-7890</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MailIcon />
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <p className="text-sm text-gray-600">info@conefa.com.ar</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-primary/10 shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1819.6977081488224!2d-65.30073649377897!3d-24.192927206735092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941b0f4ac4495fb9%3A0x467385c16d522e6!2sCONEFA!5e0!3m2!1ses-419!2sar!4v1783645284814!5m2!1ses-419!2sar"
                className="w-full"
                height="300"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-400">
            Desarrollado por Velazquez Rocio & Velazquez Mauricio
          </p>
        </div>
      </section>
    </div>
  )
}

export default Home
