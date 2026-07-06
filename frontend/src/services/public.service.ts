import type { NextTripResponse } from '../types/operator'
import { apiClient } from '../lib/api'

export async function getNextTrips(): Promise<NextTripResponse> {
  return apiClient('/public/next-trips')
}
