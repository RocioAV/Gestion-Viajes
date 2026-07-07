import type { SignOptions } from 'jsonwebtoken'
import process from 'node:process'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN: NonNullable<SignOptions['expiresIn']> = (process.env.JWT_EXPIRES_IN ?? '24h') as NonNullable<SignOptions['expiresIn']>

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  assigned_location: 'JUJUY' | 'SALTA'
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  })

  if (!user) {
    throw Object.assign(new Error('Credenciales inválidas'), { status: 401 })
  }

  const isValid = await bcrypt.compare(input.password, user.password)

  if (!isValid) {
    throw Object.assign(new Error('Credenciales inválidas'), { status: 401 })
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      assigned_location: user.assigned_location,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  )

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      assigned_location: user.assigned_location,
    },
  }
}

export interface ChangePasswordInput {
  userId: number
  currentPassword: string
  newPassword: string
}

export async function changePassword(input: ChangePasswordInput) {
  const user = await prisma.user.findUnique({
    where: { id: input.userId },
  })

  if (!user) {
    throw Object.assign(new Error('Usuario no encontrado'), { status: 404 })
  }

  const isValid = await bcrypt.compare(input.currentPassword, user.password)

  if (!isValid) {
    throw Object.assign(new Error('La contraseña actual no es correcta'), { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(input.newPassword, 10)

  await prisma.user.update({
    where: { id: input.userId },
    data: { password: hashedPassword },
  })
}

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  })

  if (existing) {
    throw Object.assign(new Error('Email already registered'), { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(input.password, 10)

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: 'OPERATOR',
      assigned_location: input.assigned_location,
    },
  })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    assigned_location: user.assigned_location,
  }
}
