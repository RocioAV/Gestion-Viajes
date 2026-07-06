import type { Cell, Row } from 'exceljs'
import type { ExportTripsFilters } from '../schemas/export.schema'
import { Buffer } from 'node:buffer'
import ExcelJS from 'exceljs'
import { prisma } from '../lib/prisma'

function applyHeaderStyle(row: Row) {
  row.eachCell((cell: Cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2C3E50' },
    }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    }
  })
}

function applyDataCellStyle(cell: Cell) {
  cell.border = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
  }
  cell.alignment = { vertical: 'middle' }
}

export async function exportTripReport(filters: ExportTripsFilters): Promise<Buffer> {
  const where: Record<string, unknown> = {}

  if (filters.status) {
    where.status = filters.status
  }

  if (filters.origin) {
    where.origin = filters.origin
  }

  if (filters.destination) {
    where.destination = filters.destination
  }

  if (filters.from || filters.to) {
    where.departure_at = {}

    if (filters.from) {
      ;(where.departure_at as Record<string, unknown>).gte = new Date(filters.from)
    }

    if (filters.to) {
      ;(where.departure_at as Record<string, unknown>).lte = new Date(filters.to)
    }
  }

  const trips = await prisma.trip.findMany({
    where,
    orderBy: { departure_at: 'asc' },
  })

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Sistema de Gestión de Viajes'
  workbook.created = new Date()

  const sheet = workbook.addWorksheet('Reporte de Viajes')

  sheet.columns = [
    { header: 'ID Viaje', key: 'id', width: 12 },
    { header: 'Origen', key: 'origin', width: 15 },
    { header: 'Destino', key: 'destination', width: 15 },
    { header: 'Fecha Salida', key: 'departure_at', width: 22 },
    { header: 'Precio Pasaje', key: 'price_per_passenger', width: 18 },
  ]

  applyHeaderStyle(sheet.getRow(1))

  for (const trip of trips) {
    const row = sheet.addRow({
      id: trip.id,
      origin: trip.origin,
      destination: trip.destination,
      departure_at: trip.departure_at,
      price_per_passenger: Number(trip.price_per_passenger),
    })

    applyDataCellStyle(row.getCell('id'))
    applyDataCellStyle(row.getCell('origin'))
    applyDataCellStyle(row.getCell('destination'))

    const dateCell = row.getCell('departure_at')
    applyDataCellStyle(dateCell)
    dateCell.numFmt = 'DD/MM/YYYY HH:mm'

    const priceCell = row.getCell('price_per_passenger')
    applyDataCellStyle(priceCell)
    priceCell.numFmt = '$#,##0.00'
  }

  if (trips.length > 0) {
    const lastDataRow = trips.length + 1
    const totalRow = sheet.addRow({
      id: '',
      origin: '',
      destination: '',
      departure_at: 'TOTAL',
      price_per_passenger: { formula: `SUM(E2:E${lastDataRow})` },
    })

    totalRow.font = { bold: true }
    totalRow.getCell('departure_at').alignment = { horizontal: 'right' }

    const totalPriceCell = totalRow.getCell('price_per_passenger')
    totalPriceCell.numFmt = '$#,##0.00'
    totalPriceCell.font = { bold: true }
  }

  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}
