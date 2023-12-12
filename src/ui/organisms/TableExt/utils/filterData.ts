import { keys } from '@mantine/utils';

export const filterData = (data: Record<string, string>[], search: string | null) => {
  const query = search?.toLowerCase()?.trim() || '';

  return data.filter((item) =>
    keys(data[0]).some((key) => item[key]?.toLowerCase()?.includes(query))
  );
};
