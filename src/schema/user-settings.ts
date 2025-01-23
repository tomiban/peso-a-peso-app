import { z } from 'zod';

import { Currencies } from '@/lib/currencies';

export const UpdateUserCurrencySchema = z.object({
  currency: z.custom((value: string) => {
    const found = Currencies.some(currency => currency.value === value);
    if (!found) {
      throw new Error('Moneda inválida');
    }
    return value;
  }),
});
