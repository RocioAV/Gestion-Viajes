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

export async function loginUser(data: LoginBody): Promise<LoginResponse> {
  const response = await apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  setToken(response.result.token)
  setUser(response.result.user)
  return response
}
