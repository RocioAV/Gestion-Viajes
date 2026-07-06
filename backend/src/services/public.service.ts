import { prisma } from '../lib/prisma'

export async function getNextTrips() {
  const [jujuy, salta] = await Promise.all([
    prisma.trip.findFirst({
      where: { status: 'PENDING', origin: 'JUJUY' },
      include: { vehicle: { include: { driver: true } } },
      orderBy: { departure_at: 'asc' },
    }),
    prisma.trip.findFirst({
      where: { status: 'PENDING', origin: 'SALTA' },
      include: { vehicle: { include: { driver: true } } },
      orderBy: { departure_at: 'asc' },
    }),
  ])

  return { jujuy, salta }
}
