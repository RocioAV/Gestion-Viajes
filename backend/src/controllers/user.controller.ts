import type { NextFunction, Request, Response } from 'express'
import { deleteUser, getUsers, resetUserPassword, restoreUser } from '../services/user.service'

export async function handleGetUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const includeDeleted = req.query.include_deleted === 'true'
    const users = await getUsers(includeDeleted)
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

export async function handleRestoreUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    await restoreUser(id)
    res.json({ message: 'Usuario restaurado correctamente' })
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
