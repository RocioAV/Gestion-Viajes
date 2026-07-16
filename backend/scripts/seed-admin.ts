/* eslint-disable perfectionist/sort-imports */
import 'dotenv/config'
import process from 'node:process'
import bcrypt from 'bcryptjs'
import { prisma } from '../src/lib/prisma'
/* eslint-enable perfectionist/sort-imports */

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@gestionviajes.com'
  const password = process.env.ADMIN_PASSWORD ?? 'admin123'

  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    console.log(`Admin user already exists: ${email}`)
    return
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Administrator',
      email,
      password: hashedPassword,
      role: 'ADMIN',
      assigned_location: null,
    },
  })

  console.log(`Admin user created: ${admin.email}`)

  const existingPrice = await prisma.appSetting.findUnique({ where: { key: 'base_price' } })

  if (!existingPrice) {
    await prisma.appSetting.create({
      data: { key: 'base_price', value: '15000' },
    })
    console.log('Base price setting created: 15000')
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
