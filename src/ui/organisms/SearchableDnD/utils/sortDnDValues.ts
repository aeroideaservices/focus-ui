import { TSelectData } from '@/types/models_v2/models_v2';

export const sortDnDValues = (values: string[] | undefined, data: TSelectData[]): TSelectData[] => {
  const result: TSelectData[] = [];

  if (values) {
    values.forEach((value) => {
      data.forEach((el) => {
        if (el.value === value) {
          result.push(el);
        }
      });
    });
  }

  return result;
};
