import type { NextFunction, Request, Response } from 'express'
import * as v from 'valibot'
import { exportTripsSchema } from '../schemas/export.schema'
import { exportTripReport } from '../services/export.service'

export async function handleExportTrips(req: Request, res: Response, next: NextFunction) {
  try {
    const result = v.safeParse(exportTripsSchema, {
      from: req.query.from ?? undefined,
      to: req.query.to ?? undefined,
      status: req.query.status ?? undefined,
      origin: req.query.origin ?? undefined,
      destination: req.query.destination ?? undefined,
    })

    if (!result.success) {
      res.status(400).json({
        error: 'Validation failed',
        issues: v.flatten(result.issues),
      })
      return
    }

    const buffer = await exportTripReport(result.output)

    const fromStr = result.output.from ?? 'inicio'
    const toStr = result.output.to ?? 'fin'
    const filename = `reporte_viajes_${fromStr}_al_${toStr}.xlsx`

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.send(buffer)
  }
  catch (error) {
    next(error)
  }
}
