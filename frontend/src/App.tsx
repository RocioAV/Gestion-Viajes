import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Registro from './pages/admin/Registro'
import RecuperarPassword from './pages/RecuperarPassword'

function App() {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary/10 via-white to-secondary/10">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/registro" element={<Registro />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
      </Routes>
    </div>
  )
}

export default App
