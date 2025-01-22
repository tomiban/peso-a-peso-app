import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().max(20).min(3),
  icon: z.string().max(30),
  type: z.enum(['INGRESO', 'GASTO']),
});

export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;
