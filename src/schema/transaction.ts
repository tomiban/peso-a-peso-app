import { z } from 'zod';

export const CreateTransaction = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01),
  description: z.string().optional(),
  date: z.coerce.date(),
  category: z.string().optional(),
  type: z.union([z.literal('INGRESO'), z.literal('GASTO')]),
});

export type CreateTransactionSchemaType = z.infer<typeof CreateTransaction>;
