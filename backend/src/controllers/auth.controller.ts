import type { NextFunction, Request, Response } from 'express'
import { loginUser, registerUser } from '../services/auth.service'

export async function handleLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await loginUser(req.body)
    res.json({
      message: 'Login exitoso',
      result,
    })
  }
  catch (error) {
    next(error)
  }
}

export async function handleRegister(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await registerUser(req.body)
    res.status(201).json({ message: 'Registro exitoso', user })
  }
  catch (error) {
    next(error)
  }
}
