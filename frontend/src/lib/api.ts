import { getToken, removeToken, removeUser } from './auth'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 401 && token) {
    removeToken()
    removeUser()
    window.location.href = '/login'
    throw new Error('Sesión expirada')
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error ?? `Error ${response.status}`)
  }

  return response.json() as Promise<T>
}
