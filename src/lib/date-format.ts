export const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};
