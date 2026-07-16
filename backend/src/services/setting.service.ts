import { prisma } from '../lib/prisma'

export async function getBasePrice() {
  const setting = await prisma.appSetting.findUnique({ where: { key: 'base_price' } })

  if (!setting) {
    throw Object.assign(new Error('Configuración de precio base no encontrada'), { status: 404 })
  }

  return setting
}

export async function updateBasePrice(value: string) {
  return prisma.appSetting.upsert({
    where: { key: 'base_price' },
    update: { value },
    create: { key: 'base_price', value },
  })
}
