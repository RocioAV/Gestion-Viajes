import type { CreateVehicleInput, UpdateVehicleInput, VehicleFilters } from '../schemas/vehicle.schema'
import { prisma } from '../lib/prisma'

export async function createVehicle(input: CreateVehicleInput, currentLocation: string) {
  const driver = await prisma.driver.findUnique({
    where: { id: input.driver_id },
  })

  if (!driver) {
    throw Object.assign(new Error('Chofer no encontrado'), { status: 404 })
  }

  const existingVehicle = await prisma.vehicle.findFirst({
    where: { driver_id: input.driver_id },
  })

  if (existingVehicle) {
    throw Object.assign(new Error('Este chofer ya tiene un vehículo asignado'), { status: 409 })
  }

  const existingPlate = await prisma.vehicle.findUnique({
    where: { license_plate: input.license_plate },
  })

  if (existingPlate) {
    throw Object.assign(new Error('Ya existe un vehículo con esa patente'), { status: 409 })
  }

  return prisma.vehicle.create({
    data: {
      ...input,
      status: 'AVAILABLE',
      current_location: currentLocation,
    },
  })
}

export async function getVehicles(filters: VehicleFilters) {
  const where: Record<string, unknown> = {}

  if (filters.status) {
    where.status = filters.status
  }

  if (filters.current_location) {
    where.current_location = filters.current_location
  }

  if (filters.driver_id) {
    where.driver_id = filters.driver_id
  }

  if (filters.model) {
    where.model = { contains: filters.model, mode: 'insensitive' }
  }

  return prisma.vehicle.findMany({
    where,
    include: { driver: true },
  })
}

export async function getVehicleById(id: number) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: { driver: true },
  })

  if (!vehicle) {
    throw Object.assign(new Error('Vehículo no encontrado'), { status: 404 })
  }

  return vehicle
}

export async function updateVehicle(id: number, input: UpdateVehicleInput) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } })

  if (!vehicle) {
    throw Object.assign(new Error('Vehículo no encontrado'), { status: 404 })
  }

  if (input.driver_id) {
    const driver = await prisma.driver.findUnique({
      where: { id: input.driver_id },
    })

    if (!driver) {
      throw Object.assign(new Error('Chofer no encontrado'), { status: 404 })
    }

    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        driver_id: input.driver_id,
        id: { not: id },
      },
    })

    if (existingVehicle) {
      throw Object.assign(new Error('Este chofer ya tiene un vehículo asignado'), { status: 409 })
    }
  }

  if (input.license_plate) {
    const existingPlate = await prisma.vehicle.findFirst({
      where: {
        license_plate: input.license_plate,
        id: { not: id },
      },
    })

    if (existingPlate) {
      throw Object.assign(new Error('Ya existe un vehículo con esa patente'), { status: 409 })
    }
  }

  const data = Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  )

  return prisma.vehicle.update({
    where: { id },
    data,
  })
}

export async function deleteVehicle(id: number) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } })

  if (!vehicle) {
    throw Object.assign(new Error('Vehículo no encontrado'), { status: 404 })
  }

  return prisma.vehicle.delete({ where: { id } })
}
