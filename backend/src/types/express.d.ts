declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number
        role: string
        assigned_location: string | null
      }
    }
  }
}

export {}
