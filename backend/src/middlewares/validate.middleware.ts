import type { NextFunction, Request, Response } from 'express'
import * as v from 'valibot'

export function validate<T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
  schema: T,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = v.safeParse(schema, req.body)

    if (!result.success) {
      res.status(400).json({
        error: 'Validation failed',
        issues: v.flatten(result.issues),
      })
      return
    }

    req.body = result.output
    next()
  }
}
