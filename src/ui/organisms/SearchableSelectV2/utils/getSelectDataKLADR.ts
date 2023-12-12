import { TSelectData } from '@/types/models_v2/models_v2';

export const getSelectDataKLADR = (items: Record<string, any>[]): TSelectData[] => {
  const result: TSelectData[] = [];

  if (items && items.length > 0) {
    items.map((item) => {
      const itemData: TSelectData = {
        value: '',
        label: '',
        code: '',
      };

      itemData.value = item.kladrId;
      itemData.label = item.value;
      itemData.code = item.fiasId;

      result.push(itemData);
    });
  }

  return result;
};
