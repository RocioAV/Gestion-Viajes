import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Registro from './pages/admin/Registro'
import Home from './pages/Home'
import Login from './pages/Login'
import RecuperarPassword from './pages/RecuperarPassword'

function App() {
  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-primary/10 via-white to-secondary/10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/registro" element={<Registro />} />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />
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
