export const fileDateFormat = (date: string): string => {
  const curDate = new Date(date.replace(/-/g, '/'));

  const dateTimeFormat = (d: Date, options: Intl.DateTimeFormatOptions) => {
    const dtf = new Intl.DateTimeFormat('ru-RU', options);

    return dtf.format(d);
  };

  return dateTimeFormat(curDate, {});
};
