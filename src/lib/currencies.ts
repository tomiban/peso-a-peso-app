export const Currencies = [
  { label: '$ Peso Argentino (ARS)', value: 'ARS', locale: 'es-AR' },
  { label: '$ Dolar Estadounidense (USD)', value: 'USD', locale: 'en-US' },
  { label: '€ Euro (EUR)', value: 'EUR', locale: 'de-DE' },
];

export type Currency = (typeof Currencies)[0];
