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

export async function getDrivers(includeDeleted = false) {
  return prisma.driver.findMany({
    where: includeDeleted ? {} : { deleted_at: null },
    include: { vehicle: true },
  })
}

export async function getDriverById(id: number) {
  const driver = await prisma.driver.findUnique({
    where: { id, deleted_at: null },
    include: { vehicle: true },
  })

  if (!driver) {
    throw Object.assign(new Error('Chofer no encontrado'), { status: 404 })
  }

  return driver
}

export async function updateDriver(id: number, input: UpdateDriverInput) {
  const driver = await prisma.driver.findUnique({ where: { id, deleted_at: null } })

  if (!driver) {
    throw Object.assign(new Error('Chofer no encontrado'), { status: 404 })
  }

  if (input.national_id) {
    const existing = await prisma.driver.findFirst({
      where: {
        national_id: input.national_id,
        id: { not: id },
        deleted_at: null,
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

export async function restoreDriver(id: number) {
  const driver = await prisma.driver.findUnique({
    where: { id },
    select: { id: true, deleted_at: true },
  })

  if (!driver) {
    throw Object.assign(new Error('Chofer no encontrado'), { status: 404 })
  }

  if (!driver.deleted_at) {
    throw Object.assign(new Error('El chofer ya está activo'), { status: 400 })
  }

  return prisma.driver.update({
    where: { id },
    data: { deleted_at: null },
  })
}

export async function deleteDriver(id: number) {
  const driver = await prisma.driver.findUnique({
    where: { id, deleted_at: null },
    include: { vehicle: true },
  })

  if (!driver) {
    throw Object.assign(new Error('Chofer no encontrado'), { status: 404 })
  }

  await prisma.$transaction(async (tx) => {
    if (driver.vehicle) {
      await tx.vehicle.update({
        where: { id: driver.vehicle.id },
        data: { status: 'OUT_OF_SERVICE' },
      })
    }

    await tx.driver.update({
      where: { id },
      data: { deleted_at: new Date() },
    })
  })
}

export async function toggleAvailability(id: number) {
  const driver = await prisma.driver.findUnique({
    where: { id, deleted_at: null },
    include: { vehicle: true },
  })

  if (!driver) {
    throw Object.assign(new Error('Chofer no encontrado'), { status: 404 })
  }

  if (!driver.vehicle) {
    throw Object.assign(new Error('El chofer no tiene un vehículo asociado'), { status: 400 })
  }

  const newStatus = driver.vehicle.status === 'AVAILABLE' ? 'OUT_OF_SERVICE' : 'AVAILABLE'

  await prisma.vehicle.update({
    where: { id: driver.vehicle.id },
    data: { status: newStatus },
  })

  return prisma.driver.findUnique({
    where: { id, deleted_at: null },
    include: { vehicle: true },
  })
}
