import { z } from 'zod';

export const CreateTransactionSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: 'El monto debe ser mayor a 0' })
    .multipleOf(0.01, { message: 'El monto debe tener máximo 2 decimales' })
    .max(999_999_999, { message: 'El monto es muy grande' }),
  note: z.string().optional(),
  date: z.coerce.date({
    errorMap: () => ({ message: 'La fecha es inválida' }),
  }),
  category: z.string({
    required_error: 'La categoría es obligatoria',
    invalid_type_error: 'La categoría debe ser un texto válido',
  }),
  type: z.union([z.literal('INCOME'), z.literal('EXPENSE')], {
    errorMap: () => ({ message: 'El tipo debe ser INCOME o EXPENSE' }),
  }),
});

export type CreateTransactionSchemaType = z.infer<
  typeof CreateTransactionSchema
>;
