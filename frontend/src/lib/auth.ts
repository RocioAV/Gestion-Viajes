const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export interface User {
  id: number
  name: string
  email: string
  role: string
  assigned_location: string | null
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function getUser(): User | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw)
    return null
  try {
    return JSON.parse(raw) as User
  }
  catch {
    return null
  }
}

export function setUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function removeUser(): void {
  localStorage.removeItem(USER_KEY)
}

export function logout(): void {
  removeToken()
  removeUser()
}
