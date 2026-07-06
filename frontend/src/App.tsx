import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import AdminLayout from './components/admin/AdminLayout'
import OperatorLayout from './components/operator/OperatorLayout'
import AdminDriversPage from './pages/admin/AdminDriversPage'
import Registro from './pages/admin/Registro'
import AdminTripsPage from './pages/admin/TripsPage'
import UsersPage from './pages/admin/UsersPage'
import CrearDriverVehicle from './pages/drivers/CrearDriverVehicle'
import Home from './pages/Home'
import Login from './pages/Login'
import DriversPage from './pages/operator/DriversPage'
import JoinQueuePage from './pages/operator/JoinQueuePage'
import QueuePage from './pages/operator/QueuePage'
import TripsPage from './pages/operator/TripsPage'
import RecuperarPassword from './pages/RecuperarPassword'

function OperatorRoutes() {
  return (
    <OperatorLayout>
      <Outlet />
    </OperatorLayout>
  )
}

function AdminRoutes() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}

function App() {
  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-primary/10 via-white to-secondary/10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />

          <Route path="/admin" element={<AdminRoutes />}>
            <Route index element={<Navigate to="viajes" replace />} />
            <Route path="viajes" element={<AdminTripsPage />} />
            <Route path="usuarios" element={<UsersPage />} />
            <Route path="choferes" element={<AdminDriversPage />} />
            <Route path="choferes/crear" element={<CrearDriverVehicle />} />
            <Route path="operadores/crear" element={<Registro />} />
          </Route>

          <Route path="/operador" element={<OperatorRoutes />}>
            <Route index element={<Navigate to="choferes" replace />} />
            <Route path="choferes" element={<DriversPage />} />
            <Route path="ingresar-cola" element={<JoinQueuePage />} />
            <Route path="cola" element={<QueuePage />} />
            <Route path="viajes" element={<TripsPage />} />
          </Route>
        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default App
