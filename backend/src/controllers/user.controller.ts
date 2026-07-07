import type { NextFunction, Request, Response } from 'express'
import { deleteUser, getUsers, resetUserPassword } from '../services/user.service'

export async function handleGetUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await getUsers()
    res.json({ users })
  }
  catch (error) {
    next(error)
  }
}

export async function handleDeleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    await deleteUser(id)
    res.json({ message: 'Usuario eliminado exitosamente' })
  }
  catch (error) {
    next(error)
  }
}

export async function handleResetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    await resetUserPassword(id, req.body.newPassword)
    res.json({ message: 'Contraseña restablecida correctamente' })
  }
  catch (error) {
    next(error)
  }
}
