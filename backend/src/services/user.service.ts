import { prisma } from '../lib/prisma'

export async function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      assigned_location: true,
      created_at: true,
    },
    orderBy: { created_at: 'desc' },
  })
}

export async function deleteUser(id: number) {
  const user = await prisma.user.findUnique({ where: { id } })

  if (!user) {
    throw Object.assign(new Error('Usuario no encontrado'), { status: 404 })
  }

  if (user.role === 'ADMIN') {
    throw Object.assign(new Error('No se puede eliminar un administrador'), { status: 409 })
  }

  return prisma.user.delete({ where: { id } })
}
