export const setFormatDate = (
  date: Date | string | null,
  options: Intl.DateTimeFormatOptions,
  locales: string | string[] = 'ru-RU'
) => {
  if (!date) return '';
  const dtf = new Intl.DateTimeFormat(locales, options);

  return dtf.format(new Date(date));
};
