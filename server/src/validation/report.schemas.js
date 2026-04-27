import { z } from 'zod';

export const reportCreateSchema = z.object({
  title: z.string().min(3),
  filters: z.record(z.any()).default({}),
});
