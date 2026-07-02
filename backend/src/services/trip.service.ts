import type { CreateTripInput, TripFilters } from '../schemas/trip.schema'
import { prisma } from '../lib/prisma'

function oppositeLocation(location: string): string {
  return location === 'JUJUY' ? 'SALTA' : 'JUJUY'
}

async function getBasePriceFromSettings(): Promise<number> {
  const setting = await prisma.appSetting.findUnique({ where: { key: 'base_price' } })

  if (!setting) {
    throw Object.assign(new Error('Configuración de precio base no encontrada'), { status: 500 })
  }

  return Number(setting.value)
}

export async function createTrip(input: CreateTripInput, operator: { userId: number, assigned_location: string }) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: input.vehicle_id },
    include: { driver: true },
  })

  if (!vehicle) {
    throw Object.assign(new Error('Vehículo no encontrado'), { status: 404 })
  }

  if (vehicle.status !== 'AVAILABLE') {
    throw Object.assign(new Error('El vehículo no está disponible'), { status: 400 })
  }

  if (vehicle.current_location !== operator.assigned_location) {
    throw Object.assign(new Error('El vehículo no está en la ubicación del operador'), { status: 400 })
  }

  if (input.occupied_seats > vehicle.passenger_capacity) {
    throw Object.assign(new Error(`La capacidad máxima del vehículo es ${vehicle.passenger_capacity} asientos`), { status: 400 })
  }

  const origin = operator.assigned_location
  const destination = oppositeLocation(origin)

  const pricePerPassenger = input.price_per_passenger ?? await getBasePriceFromSettings()
  const baseCommission = input.base_commission ?? 0

  const [trip] = await prisma.$transaction([
    prisma.trip.create({
      data: {
        vehicle_id: vehicle.id,
        departure_operator_id: operator.userId,
        origin,
        destination,
        occupied_seats: input.occupied_seats,
        price_per_passenger: pricePerPassenger,
        base_commission: baseCommission,
        status: 'IN_PROGRESS',
      },
      include: {
        vehicle: true,
        departure_operator: true,
      },
    }),
    prisma.vehicle.update({
      where: { id: vehicle.id },
      data: {
        status: 'ON_TRIP',
        queue_entry_at: null,
      },
    }),
  ])

  return trip
}

export async function completeTrip(tripId: number, operator: { userId: number, assigned_location: string }) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { vehicle: true },
  })

  if (!trip) {
    throw Object.assign(new Error('Viaje no encontrado'), { status: 404 })
  }

  if (trip.status !== 'IN_PROGRESS') {
    throw Object.assign(new Error('El viaje no está en progreso'), { status: 400 })
  }

  if (trip.destination !== operator.assigned_location) {
    throw Object.assign(new Error('Solo un operador del destino puede completar el viaje'), { status: 403 })
  }

  const [updatedTrip] = await prisma.$transaction([
    prisma.trip.update({
      where: { id: tripId },
      data: {
        status: 'COMPLETED',
        arrival_at: new Date(),
        arrival_operator_id: operator.userId,
      },
      include: {
        vehicle: true,
        departure_operator: true,
        arrival_operator: true,
      },
    }),
    prisma.vehicle.update({
      where: { id: trip.vehicle_id },
      data: {
        status: 'AVAILABLE',
        current_location: trip.destination,
        queue_entry_at: new Date(),
      },
    }),
  ])

  return updatedTrip
}

export async function cancelTrip(tripId: number) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { vehicle: true },
  })

  if (!trip) {
    throw Object.assign(new Error('Viaje no encontrado'), { status: 404 })
  }

  if (trip.status !== 'IN_PROGRESS') {
    throw Object.assign(new Error('El viaje no está en progreso'), { status: 400 })
  }

  const [updatedTrip] = await prisma.$transaction([
    prisma.trip.update({
      where: { id: tripId },
      data: { status: 'CANCELLED' },
      include: {
        vehicle: true,
        departure_operator: true,
      },
    }),
    prisma.vehicle.update({
      where: { id: trip.vehicle_id },
      data: {
        status: 'AVAILABLE',
        queue_entry_at: new Date(),
      },
    }),
  ])

  return updatedTrip
}

export async function getTrips(filters: TripFilters) {
  const where: Record<string, unknown> = {}

  if (filters.status) {
    where.status = filters.status
  }

  if (filters.origin) {
    where.origin = filters.origin
  }

  if (filters.destination) {
    where.destination = filters.destination
  }

  if (filters.vehicle_id) {
    where.vehicle_id = filters.vehicle_id
  }

  if (filters.departure_operator_id) {
    where.departure_operator_id = filters.departure_operator_id
  }

  if (filters.date_from || filters.date_to) {
    where.departure_at = {}

    if (filters.date_from) {
      ;(where.departure_at as Record<string, unknown>).gte = new Date(filters.date_from)
    }

    if (filters.date_to) {
      ;(where.departure_at as Record<string, unknown>).lte = new Date(filters.date_to)
    }
  }

  return prisma.trip.findMany({
    where,
    include: {
      vehicle: { include: { driver: true } },
      departure_operator: true,
      arrival_operator: true,
    },
    orderBy: { departure_at: 'desc' },
  })
}
