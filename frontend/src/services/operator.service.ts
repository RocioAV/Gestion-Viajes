import type { AddPassengerBody, CreateTripBody, DriverWithVehicle, JoinQueueBody, RemovePassengerBody, TripFilters, TripWithRelations, Vehicle } from '../types/operator'
import { apiClient } from '../lib/api'

export async function getDrivers(): Promise<{ drivers: DriverWithVehicle[] }> {
  return apiClient('/drivers')
}

export async function toggleDriverAvailability(
  driverId: number,
): Promise<{ message: string, driver: DriverWithVehicle }> {
  return apiClient(`/drivers/${driverId}/toggle-availability`, {
    method: 'PATCH',
  })
}

export async function getAvailableVehicles(
  location: string,
): Promise<{ vehicles: Vehicle[] }> {
  const params = new URLSearchParams({
    status: 'AVAILABLE',
    current_location: location,
  })
  return apiClient(`/vehicles?${params.toString()}`)
}

export async function createTrip(
  data: CreateTripBody,
): Promise<{ message: string, trip: TripWithRelations }> {
  return apiClient('/trips', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function joinQueue(
  data: JoinQueueBody,
): Promise<{ message: string, trip: TripWithRelations }> {
  return apiClient('/trips/join-queue', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getQueue(
  origin: string,
): Promise<{ trips: TripWithRelations[] }> {
  return getTrips({ status: 'PENDING', origin })
}

export async function addPassenger(
  tripId: number,
  data: AddPassengerBody,
): Promise<{ message: string, trip: TripWithRelations }> {
  return apiClient(`/trips/${tripId}/passengers`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function removePassenger(
  tripId: number,
  data: RemovePassengerBody,
): Promise<{ message: string, trip: TripWithRelations }> {
  return apiClient(`/trips/${tripId}/passengers/remove`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function getTrips(
  filters: TripFilters = {},
): Promise<{ trips: TripWithRelations[] }> {
  const params = new URLSearchParams()
  if (filters.status)
    params.set('status', filters.status)
  if (filters.origin)
    params.set('origin', filters.origin)
  if (filters.destination)
    params.set('destination', filters.destination)
  if (filters.date_from)
    params.set('date_from', filters.date_from)
  if (filters.date_to)
    params.set('date_to', filters.date_to)

  const query = params.toString()
  return apiClient(`/trips${query ? `?${query}` : ''}`)
}

export async function completeTrip(
  tripId: number,
): Promise<{ message: string, trip: TripWithRelations }> {
  return apiClient(`/trips/${tripId}/complete`, {
    method: 'PATCH',
  })
}

export async function cancelTrip(
  tripId: number,
): Promise<{ message: string, trip: TripWithRelations }> {
  return apiClient(`/trips/${tripId}/cancel`, {
    method: 'PATCH',
  })
}
