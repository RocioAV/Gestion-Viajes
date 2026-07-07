import { Link } from 'react-router-dom'
import FormLayout from '../components/FormLayout'

function RecuperarPassword() {
  return (
    <FormLayout backTo="/login">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Recuperar contraseña</h1>
      <p className="text-sm text-gray-500 mb-6">
        Esta funcionalidad no está disponible. Contactá a un administrador para restablecer tu contraseña.
      </p>

      <Link
        to="/login"
        className="block w-full text-center bg-primary text-white rounded-lg py-2.5 font-medium
                   hover:bg-primary/90 transition-colors"
      >
        Volver al inicio de sesión
      </Link>
    </FormLayout>
  )
}

export default RecuperarPassword
