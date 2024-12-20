import { z } from 'zod'

const maxSellingDate = new Date()
const minSellingDate = new Date(1960, 0, 1)
const maxYearManufacture = new Date().getFullYear()

const Car = z.object({
  brand: z
    .string()
    .max(25, { message: 'A marca deve ter, no máximo, 25 caracteres' }),

  model: z
    .string()
    .max(25, { message: 'O modelo deve ter, no máximo, 25 caracteres' }),

  color: z
    .string()
    .max(12, { message: 'A cor deve ter, no máximo, 12 caracteres' }),

  year_manufacture: z.coerce
    .number()
    .min(1960, { message: 'O ano de fabricação deve ser no mínimo 1960' })
    .max(maxYearManufacture, {
      message: `O ano de fabricação deve ser no máximo ${maxYearManufacture}`,
    }),

  imported: z.boolean(),

  plates: z
    .string()
    .max(8, { message: 'A placa pode ter, no máximo, 8 caracteres' })
    .regex(/^[A-Z0-9-]*$/, { message: 'A placa deve ter um formato válido' }),

  selling_date: z.coerce
    .date()
    .min(minSellingDate, { message: 'Data de venda está muito no passado' })
    .max(maxSellingDate, {
      message: 'Data de venda não deve ser maior que a data atual',
    })
    .nullable(),

  selling_price: z.coerce
    .number()
    .gte(1000, { message: 'O valor deve ser maior que R$ 1.000' })
    .lte(5000000, { message: 'O valor deve ser menor que R$ 5.000.000' })
    .nullable()
})

export default Car