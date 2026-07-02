import { apiClient } from '../lib/api'

interface CreateDriverBody {
  first_name: string
  last_name: string
  phone: string
  national_id: string
}

interface CreateDriverResponse {
  message: string
  driver: {
    id: number
    first_name: string
    last_name: string
    phone: string
    national_id: string
  }
}

interface CreateVehicleBody {
  license_plate: string
  model: string
  passenger_capacity: number
  driver_id: number
}

interface CreateVehicleResponse {
  message: string
  vehicle: {
    id: number
    license_plate: string
    model: string
    passenger_capacity: number
    status: string
    current_location: string
    driver_id: number
  }
}

export async function createDriver(data: CreateDriverBody): Promise<CreateDriverResponse> {
  return apiClient<CreateDriverResponse>('/drivers', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function createVehicle(data: CreateVehicleBody): Promise<CreateVehicleResponse> {
  return apiClient<CreateVehicleResponse>('/vehicles', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
