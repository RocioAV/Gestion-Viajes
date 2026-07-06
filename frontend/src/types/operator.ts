export interface Driver {
  id: number
  first_name: string
  last_name: string
  phone: string
  national_id: string
}

export interface Vehicle {
  id: number
  license_plate: string
  model: string
  passenger_capacity: number
  status: 'AVAILABLE' | 'ON_TRIP' | 'OUT_OF_SERVICE'
  current_location: 'JUJUY' | 'SALTA'
  queue_entry_at: string | null
  driver_id: number
  driver: Driver
}

export interface DriverWithVehicle extends Driver {
  vehicle: Vehicle | null
}

export interface User {
  id: number
  name: string
  email: string
  role: string
  assigned_location: string | null
}

export interface Trip {
  id: number
  vehicle_id: number
  departure_operator_id: number
  arrival_operator_id: number | null
  origin: string
  destination: string
  occupied_seats: number
  price_per_passenger: string
  base_commission: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  departure_at: string
  arrival_at: string | null
}

export interface TripWithRelations extends Trip {
  vehicle: Vehicle
  departure_operator: User
  arrival_operator: User | null
}

export interface CreateTripBody {
  vehicle_id: number
  occupied_seats: number
  price_per_passenger?: number
  base_commission?: number
}

export interface JoinQueueBody {
  vehicle_id: number
}

export interface AddPassengerBody {
  count: number
}

export interface RemovePassengerBody {
  count: number
}

export interface TripFilters {
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  origin?: 'JUJUY' | 'SALTA'
  destination?: 'JUJUY' | 'SALTA'
  date_from?: string
  date_to?: string
}
