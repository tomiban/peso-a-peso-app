import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().max(20).min(3),
  icon: z.string().max(30),
  type: z.enum(['INCOME', 'EXPENSE']),
});

export const DeleteCategorySchema = z.object({
  name: z.string().min(3).max(20),
  type: z.enum(['INCOME', 'EXPENSE']),
});

export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;
export type DeleteCategorySchemaType = z.infer<typeof DeleteCategorySchema>;
