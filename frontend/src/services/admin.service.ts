import type { AdminDriver, AdminTripFilters, AdminUser, TripWithRelations } from '../types/admin'
import { apiClient } from '../lib/api'

export async function getTrips(
  filters: AdminTripFilters = {},
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

export async function exportTrips(
  filters: AdminTripFilters = {},
): Promise<void> {
  const params = new URLSearchParams()
  if (filters.status)
    params.set('status', filters.status)
  if (filters.origin)
    params.set('origin', filters.origin)
  if (filters.destination)
    params.set('destination', filters.destination)
  if (filters.date_from)
    params.set('from', filters.date_from)
  if (filters.date_to)
    params.set('to', filters.date_to)

  const query = params.toString()
  const token = localStorage.getItem('auth_token')

  const response = await fetch(`http://localhost:4000/api/export/trips${query ? `?${query}` : ''}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  if (!response.ok)
    throw new Error('Error al exportar viajes')

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  const date = new Date().toISOString().split('T')[0]
  link.download = `Reporte_Viajes_${date}.xlsx`
  link.click()
  URL.revokeObjectURL(url)
}

export async function getUsers(): Promise<{ users: AdminUser[] }> {
  return apiClient('/users')
}

export async function deleteUser(
  userId: number,
): Promise<{ message: string }> {
  return apiClient(`/users/${userId}`, { method: 'DELETE' })
}

export async function getDrivers(): Promise<{ drivers: AdminDriver[] }> {
  return apiClient('/drivers')
}

export async function deleteDriver(
  driverId: number,
): Promise<{ message: string }> {
  return apiClient(`/drivers/${driverId}`, { method: 'DELETE' })
}

export async function resetUserPassword(
  userId: number,
  data: { newPassword: string; confirmPassword: string },
): Promise<{ message: string }> {
  return apiClient(`/users/${userId}/reset-password`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}
