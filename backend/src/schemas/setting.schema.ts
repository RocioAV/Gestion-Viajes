import * as v from 'valibot'

export const updateBasePriceSchema = v.object({
  value: v.pipe(
    v.string(),
    v.regex(/^\d+(\.\d+)?$/, 'El precio debe ser un número válido'),
    v.minLength(1, 'El valor es requerido'),
  ),
})

export type UpdateBasePriceInput = v.InferOutput<typeof updateBasePriceSchema>
