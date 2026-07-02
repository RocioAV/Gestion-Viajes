import type { CreateDriverInput, UpdateDriverInput } from '../schemas/driver.schema'
import { prisma } from '../lib/prisma'

export async function createDriver(input: CreateDriverInput) {
  const existing = await prisma.driver.findUnique({
    where: { national_id: input.national_id },
  })

  if (existing) {
    throw Object.assign(new Error('Ya existe un chofer con ese DNI'), { status: 409 })
  }

  return prisma.driver.create({ data: input })
}

export async function getDrivers() {
  return prisma.driver.findMany({
    include: { vehicles: true },
  })
}

export async function getDriverById(id: number) {
  const driver = await prisma.driver.findUnique({
    where: { id },
    include: { vehicles: true },
  })

  if (!driver) {
    throw Object.assign(new Error('Chofer no encontrado'), { status: 404 })
  }

  return driver
}

export async function updateDriver(id: number, input: UpdateDriverInput) {
  const driver = await prisma.driver.findUnique({ where: { id } })

  if (!driver) {
    throw Object.assign(new Error('Chofer no encontrado'), { status: 404 })
  }

  if (input.national_id) {
    const existing = await prisma.driver.findFirst({
      where: {
        national_id: input.national_id,
        id: { not: id },
      },
    })

    if (existing) {
      throw Object.assign(new Error('Ya existe un chofer con ese DNI'), { status: 409 })
    }
  }

  const data = Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  )

  return prisma.driver.update({
    where: { id },
    data,
  })
}

export async function deleteDriver(id: number) {
  const driver = await prisma.driver.findUnique({
    where: { id },
    include: { vehicles: true },
  })

  if (!driver) {
    throw Object.assign(new Error('Chofer no encontrado'), { status: 404 })
  }

  if (driver.vehicles.length > 0) {
    throw Object.assign(
      new Error('No se puede eliminar un chofer con vehículos asociados'),
      { status: 409 },
    )
  }

  return prisma.driver.delete({ where: { id } })
}
