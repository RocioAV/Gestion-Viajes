import { Navigate, Outlet } from 'react-router-dom'
import { getToken, getUser } from '../lib/auth'

interface ProtectedRouteProps {
  allowedRole: 'ADMIN' | 'OPERATOR'
}

function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const token = getToken()
  const user = getUser()

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== allowedRole) {
    const redirect = user.role === 'ADMIN' ? '/admin/viajes' : '/operador/choferes'
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
