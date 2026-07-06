import * as v from 'valibot'

const tripStatusEnum = v.union(
  [v.literal('PENDING'), v.literal('IN_PROGRESS'), v.literal('COMPLETED'), v.literal('CANCELLED')],
  'Estado debe ser PENDING, IN_PROGRESS, COMPLETED o CANCELLED',
)

const locationEnum = v.union(
  [v.literal('JUJUY'), v.literal('SALTA')],
  'Ubicación debe ser JUJUY o SALTA',
)

export const exportTripsSchema = v.pipe(
  v.object({
    from: v.optional(v.string()),
    to: v.optional(v.string()),
    status: v.optional(tripStatusEnum),
    origin: v.optional(locationEnum),
    destination: v.optional(locationEnum),
  }),
  v.check(
    obj => Boolean(obj.from || obj.to || obj.status || obj.origin || obj.destination),
    'Debe proporcionar al menos un filtro para exportar',
  ),
)

export type ExportTripsFilters = v.InferOutput<typeof exportTripsSchema>
