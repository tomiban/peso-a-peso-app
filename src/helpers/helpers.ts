/* eslint-disable import/no-named-as-default-member */
import chroma from 'chroma-js';

import { Currencies } from '@/lib/currencies';

export function DateToUTCDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    ),
  );
}

export function GetFormattedForCurrency(currency: string) {
  const locale = Currencies.find(c => c.value === currency)?.locale;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  });
}

export function GetHexRandomColor() {
  return chroma
    .random()
    .saturate(2) // Más saturación
    .luminance(0.6) // Brillo óptimo para dark mode
    .hex();
}
