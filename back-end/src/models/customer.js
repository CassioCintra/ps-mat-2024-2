import { z } from 'zod'
import { cpf } from 'cpf-cnpj-validator'

const maxBirthDate = new Date();
maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 18);

const minBirthDate = new Date();
minBirthDate.setFullYear(minBirthDate.getFullYear() - 120);

const Customer = z.object({
  name: z
    .string()
    .min(5, { message: 'O nome deve ter, no mínimo, 5 caracteres' })
    .refine(val => val.split(' ').length >= 2, {
      message: 'O nome deve incluir pelo menos um sobrenome',
    }),

  ident_document: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
    .transform(val => val.replace('_', ''))
    .refine(val => val.length === 14, { message: 'O CPF está incompleto' })
    .refine(val => cpf.isValid(val), { message: 'CPF inválido' }),

  birth_date: z
    .coerce.date()
    .min(minBirthDate, { message: 'Data de nascimento está muito no passado' })
    .max(maxBirthDate, { message: 'O cliente deve ser maior de 18 anos' }),

  street_name: z
    .string()
    .max(40, { message: 'O logradouro pode ter, no máximo, 40 caracteres' }),

  house_number: z
    .string()
    .max(10, { message: 'O número pode ter, no máximo, 10 caracteres' }),

  complements: z
    .string()
    .max(20, { message: 'O complemento pode ter, no máximo, 20 caracteres' })
    .optional(),

  district: z
    .string()
    .max(30, { message: 'O bairro pode ter, no máximo, 30 caracteres' }),

  municipality: z
    .string()
    .max(40, { message: 'O município pode ter, no máximo, 40 caracteres' }),

  state: z
    .string()
    .length(2, { message: 'UF deve ter exatamente 2 caracteres' }),

  phone: z
    .string()
    .transform(val => val.replace('_', ''))
    .refine(val => /^[0-9()-\s]+$/.test(val) && val.length === 15, {
      message: 'O número do telefone/celular está incompleto ou incorreto',
    }),

  email: z
    .string()
    .email({ message: 'E-mail inválido' }),
})

export default Customer
