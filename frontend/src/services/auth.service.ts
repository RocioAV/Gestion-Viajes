import type { User } from '../lib/auth'
import { apiClient } from '../lib/api'
import { setToken, setUser } from '../lib/auth'

interface LoginResponse {
  message: string
  result: {
    token: string
    user: User
  }
}

interface LoginBody {
  email: string
  password: string
}

interface RegisterBody {
  name: string
  email: string
  password: string
  assigned_location: string
}

interface RegisterResponse {
  message: string
  result: {
    id: number
    name: string
    email: string
    role: string
    assigned_location: string
  }
}

export async function loginUser(data: LoginBody): Promise<LoginResponse> {
  const response = await apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  setToken(response.result.token)
  setUser(response.result.user)
  return response
}

export async function registerUser(data: RegisterBody): Promise<RegisterResponse> {
  return apiClient<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
