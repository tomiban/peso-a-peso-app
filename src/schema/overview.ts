import { differenceInDays } from 'date-fns';
import { z } from 'zod';

import { MAX_DATE_RANGE_DAYS } from '@/lib/constants';
export const OverviewQuerySchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine(arguments_ => {
    const { from, to } = arguments_;
    const days = differenceInDays(to, from);

    const isValidRange = days >= 0 && days <= MAX_DATE_RANGE_DAYS;
    return isValidRange;
  });
