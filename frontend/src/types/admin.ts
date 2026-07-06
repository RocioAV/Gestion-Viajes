import type { TripFilters, TripWithRelations } from './operator'

export type { TripWithRelations }

export type AdminTripFilters = TripFilters

export interface AdminUser {
  id: number
  name: string
  email: string
  role: string
  assigned_location: string | null
  created_at: string
}

export interface AdminDriver {
  id: number
  first_name: string
  last_name: string
  phone: string
  national_id: string
  vehicle: {
    id: number
    license_plate: string
    model: string
    status: string
    current_location: string
  } | null
}
