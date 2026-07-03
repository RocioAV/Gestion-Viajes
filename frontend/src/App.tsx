import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import OperatorLayout from './components/operator/OperatorLayout'
import Registro from './pages/admin/Registro'
import CrearDriverVehicle from './pages/drivers/CrearDriverVehicle'
import Home from './pages/Home'
import Login from './pages/Login'
import CreateTripPage from './pages/operator/CreateTripPage'
import DriversPage from './pages/operator/DriversPage'
import TripsPage from './pages/operator/TripsPage'
import RecuperarPassword from './pages/RecuperarPassword'

function OperatorRoutes() {
  return (
    <OperatorLayout>
      <Outlet />
    </OperatorLayout>
  )
}

function App() {
  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-primary/10 via-white to-secondary/10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/registro" element={<Registro />} />
          <Route path="/drivers/registro" element={<CrearDriverVehicle />} />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />

          <Route path="/operador" element={<OperatorRoutes />}>
            <Route index element={<Navigate to="choferes" replace />} />
            <Route path="choferes" element={<DriversPage />} />
            <Route path="crear-viaje" element={<CreateTripPage />} />
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
