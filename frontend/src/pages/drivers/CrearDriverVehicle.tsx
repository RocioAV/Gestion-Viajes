import type { FormEvent } from 'react'
import type { DriverFormData, VehicleFormData } from '../../validations/driver-vehicle'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { safeParse } from 'valibot'
import FormLayout from '../../components/FormLayout'
import { createDriver, createVehicle } from '../../services/driver.service'
import { DriverSchema, VehicleSchema } from '../../validations/driver-vehicle'

type DriverFieldErrors = Partial<Record<keyof DriverFormData, string>>
type VehicleFieldErrors = Partial<Record<keyof VehicleFormData, string>>
type DriverTouched = Partial<Record<keyof DriverFormData, boolean>>
type VehicleTouched = Partial<Record<keyof VehicleFormData, boolean>>

function getDriverErrors(data: DriverFormData): DriverFieldErrors {
  const result = safeParse(DriverSchema, data)
  const errors: DriverFieldErrors = {}
  if (!result.success) {
    for (const issue of result.issues) {
      const key = issue.path?.[0]?.key as keyof DriverFormData | undefined
      if (key && !errors[key])
        errors[key] = issue.message
    }
  }
  return errors
}

function getVehicleErrors(data: VehicleFormData): VehicleFieldErrors {
  const result = safeParse(VehicleSchema, data)
  const errors: VehicleFieldErrors = {}
  if (!result.success) {
    for (const issue of result.issues) {
      const key = issue.path?.[0]?.key as keyof VehicleFormData | undefined
      if (key && !errors[key])
        errors[key] = issue.message
    }
  }
  return errors
}

const INITIAL_DRIVER: DriverFormData = {
  first_name: '',
  last_name: '',
  phone: '',
  national_id: '',
}

const INITIAL_VEHICLE: VehicleFormData = {
  license_plate: '',
  model: '',
  passenger_capacity: 0,
  current_location: '' as VehicleFormData['current_location'],
}

const INPUT_CLASS = 'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition'
const SELECT_CLASS = 'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition bg-white cursor-pointer'

function CrearDriverVehicle() {
  const [currentStep, setCurrentStep] = useState(1)
  const [driver, setDriver] = useState<DriverFormData>(INITIAL_DRIVER)
  const [vehicle, setVehicle] = useState<VehicleFormData>(INITIAL_VEHICLE)
  const [driverTouched, setDriverTouched] = useState<DriverTouched>({})
  const [vehicleTouched, setVehicleTouched] = useState<VehicleTouched>({})
  const [loading, setLoading] = useState(false)
  const [driverId, setDriverId] = useState<number | null>(null)

  const driverErrors = getDriverErrors(driver)
  const vehicleErrors = getVehicleErrors(vehicle)
  const isDriverValid = Object.keys(driverErrors).length === 0
  const isVehicleValid = Object.keys(vehicleErrors).length === 0

  function handleDriverChange(field: keyof DriverFormData, value: string) {
    setDriver(prev => ({ ...prev, [field]: value }))
  }

  function handleVehicleChange(field: keyof VehicleFormData, value: string | number) {
    setVehicle(prev => ({ ...prev, [field]: value }))
  }

  function handleDriverBlur(field: keyof DriverFormData) {
    setDriverTouched(prev => ({ ...prev, [field]: true }))
  }

  function handleVehicleBlur(field: keyof VehicleFormData) {
    setVehicleTouched(prev => ({ ...prev, [field]: true }))
  }

  async function handleNext(e: FormEvent) {
    e.preventDefault()
    setDriverTouched({ first_name: true, last_name: true, phone: true, national_id: true })

    if (!isDriverValid)
      return

    setLoading(true)

    try {
      const res = await createDriver(driver)
      setDriverId(res.driver.id)
      toast.success('Chofer creado correctamente')
      setCurrentStep(2)
    }
    catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado'
      toast.error(message)
    }
    finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setDriver(INITIAL_DRIVER)
    setVehicle(INITIAL_VEHICLE)
    setDriverTouched({})
    setVehicleTouched({})
    setDriverId(null)
    setCurrentStep(1)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setVehicleTouched({ license_plate: true, model: true, passenger_capacity: true, current_location: true })

    if (!isVehicleValid)
      return

    setLoading(true)

    try {
      await createVehicle({ ...vehicle, driver_id: driverId! })
      toast.success('Vehículo creado correctamente')
      resetForm()
    }
    catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado'
      toast.error(message)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <FormLayout backTo="/admin/viajes">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Registro de Chofer y Vehículo</h1>
      <p className="text-sm text-gray-500 mb-6">
        Completá los datos para crear un nuevo chofer y su vehículo
      </p>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${currentStep === 1 ? 'bg-primary text-white' : 'bg-success/10 text-success'}`}>
          {currentStep > 1 ? '✓' : '1'}
        </div>
        <div className={`h-0.5 flex-1 rounded-full transition-colors ${currentStep === 2 ? 'bg-primary' : 'bg-gray-200'}`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${currentStep === 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
          2
        </div>
      </div>

      {/* Step 1: Driver */}
      {currentStep === 1 && (
        <form onSubmit={handleNext} className="space-y-4" noValidate>
          <h2 className="text-lg font-semibold text-gray-800">Datos del Chofer</h2>

          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Nombre
            </label>
            <input
              id="first_name"
              type="text"
              autoComplete="given-name"
              placeholder="Rocio"
              value={driver.first_name}
              onChange={e => handleDriverChange('first_name', e.target.value)}
              onBlur={() => handleDriverBlur('first_name')}
              disabled={loading}
              className={loading ? `${INPUT_CLASS} bg-gray-50 cursor-not-allowed` : INPUT_CLASS}
            />
            {driverTouched.first_name && driverErrors.first_name && (
              <p className="text-error text-sm mt-1">{driverErrors.first_name}</p>
            )}
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Apellido
            </label>
            <input
              id="last_name"
              type="text"
              autoComplete="family-name"
              placeholder="Ramos"
              value={driver.last_name}
              onChange={e => handleDriverChange('last_name', e.target.value)}
              onBlur={() => handleDriverBlur('last_name')}
              disabled={loading}
              className={loading ? `${INPUT_CLASS} bg-gray-50 cursor-not-allowed` : INPUT_CLASS}
            />
            {driverTouched.last_name && driverErrors.last_name && (
              <p className="text-error text-sm mt-1">{driverErrors.last_name}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
              Teléfono
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="381321233"
              value={driver.phone}
              onChange={e => handleDriverChange('phone', e.target.value)}
              onBlur={() => handleDriverBlur('phone')}
              disabled={loading}
              className={loading ? `${INPUT_CLASS} bg-gray-50 cursor-not-allowed` : INPUT_CLASS}
            />
            {driverTouched.phone && driverErrors.phone && (
              <p className="text-error text-sm mt-1">{driverErrors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="national_id" className="block text-sm font-medium text-gray-700 mb-1.5">
              DNI
            </label>
            <input
              id="national_id"
              type="text"
              placeholder="22222222"
              value={driver.national_id}
              onChange={e => handleDriverChange('national_id', e.target.value)}
              onBlur={() => handleDriverBlur('national_id')}
              disabled={loading}
              className={loading ? `${INPUT_CLASS} bg-gray-50 cursor-not-allowed` : INPUT_CLASS}
            />
            {driverTouched.national_id && driverErrors.national_id && (
              <p className="text-error text-sm mt-1">{driverErrors.national_id}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white rounded-lg py-2.5 font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {loading ? 'Creando chofer...' : 'Crear chofer y continuar'}
          </button>
        </form>
      )}

      {/* Step 2: Vehicle */}
      {currentStep === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <h2 className="text-lg font-semibold text-gray-800">Datos del Vehículo</h2>

          <div>
            <label htmlFor="license_plate" className="block text-sm font-medium text-gray-700 mb-1.5">
              Patente
            </label>
            <input
              id="license_plate"
              type="text"
              placeholder="AE123ZZ"
              value={vehicle.license_plate}
              onChange={e => handleVehicleChange('license_plate', e.target.value)}
              onBlur={() => handleVehicleBlur('license_plate')}
              className={INPUT_CLASS}
            />
            {vehicleTouched.license_plate && vehicleErrors.license_plate && (
              <p className="text-error text-sm mt-1">{vehicleErrors.license_plate}</p>
            )}
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1.5">
              Modelo
            </label>
            <input
              id="model"
              type="text"
              placeholder="Renault Logan 2023"
              value={vehicle.model}
              onChange={e => handleVehicleChange('model', e.target.value)}
              onBlur={() => handleVehicleBlur('model')}
              className={INPUT_CLASS}
            />
            {vehicleTouched.model && vehicleErrors.model && (
              <p className="text-error text-sm mt-1">{vehicleErrors.model}</p>
            )}
          </div>

          <div>
            <label htmlFor="passenger_capacity" className="block text-sm font-medium text-gray-700 mb-1.5">
              Capacidad de pasajeros
            </label>
            <input
              id="passenger_capacity"
              type="number"
              min={1}
              placeholder="4"
              value={vehicle.passenger_capacity || ''}
              onChange={e => handleVehicleChange('passenger_capacity', Number(e.target.value))}
              onBlur={() => handleVehicleBlur('passenger_capacity')}
              className={INPUT_CLASS}
            />
            {vehicleTouched.passenger_capacity && vehicleErrors.passenger_capacity && (
              <p className="text-error text-sm mt-1">{vehicleErrors.passenger_capacity}</p>
            )}
          </div>

          <div>
            <label htmlFor="current_location" className="block text-sm font-medium text-gray-700 mb-1.5">
              Sede
            </label>
            <select
              id="current_location"
              value={vehicle.current_location}
              onChange={e => handleVehicleChange('current_location', e.target.value)}
              onBlur={() => handleVehicleBlur('current_location')}
              className={SELECT_CLASS}
            >
              <option value="" disabled>
                Seleccionar sede
              </option>
              <option value="JUJUY">Jujuy</option>
              <option value="SALTA">Salta</option>
            </select>
            {vehicleTouched.current_location && vehicleErrors.current_location && (
              <p className="text-error text-sm mt-1">{vehicleErrors.current_location}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isVehicleValid || loading}
            className="w-full bg-primary text-white rounded-lg py-2.5 font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {loading ? 'Creando vehículo...' : 'Crear vehículo'}
          </button>
        </form>
      )}
    </FormLayout>
  )
}

export default CrearDriverVehicle
