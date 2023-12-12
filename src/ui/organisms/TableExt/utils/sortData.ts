import { filterData } from './filterData';

const sort = (value1: unknown, value2: unknown) => {
  if (typeof value1 === typeof value2) {
    switch (typeof value1) {
      case 'string':
        return value1.localeCompare(value2 as string);
      case 'number':
        return (value2 as number) - value1;
      case 'object':
        return 0;
      default:
        return 0;
    }
  }

  return Number(Boolean(value2)) - Number(Boolean(value1));
};

export const sortData = (
  data: Record<string, string>[],
  payload: { sortBy: keyof Record<string, string> | null; reversed: boolean; search: string }
) => {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return sort(b[sortBy], a[sortBy]);
      } else return sort(a[sortBy], b[sortBy]);
    }),
    payload.search
  );
};
