import { TSelectData } from '@/types/models_v2/models_v2';

export const getDnDValues = (items: TSelectData[]): string[] => {
  const result: string[] = [];

  items.forEach((item) => {
    result.push(item.value);
  });

  return result;
};
