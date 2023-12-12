import { TSelectData } from '@/types/models_v2/models_v2';

export const getSelectData = (
  items: Record<string, unknown>[] | string[],
  config?: {
    valueID?: string;
    labelID?: string;
    codeID?: string;
    filters?: boolean;
  }
): TSelectData[] => {
  const result: TSelectData[] = [];

  if (config && config.valueID && config.labelID) {
    (items as Record<string, unknown>[]).map((item) => {
      const selectItem: TSelectData = {
        value: '',
        label: '',
      };

      if (config.valueID) selectItem.value = item[config.valueID] as string;
      if (config.labelID) selectItem.label = item[config.labelID] as string;
      if (config.codeID) selectItem.code = item[config?.codeID] as string;

      result.push(selectItem);
    });
  }

  if (config && config.filters) {
    (items as string[]).map((item) => {
      const selectItem: TSelectData = {
        value: '',
        label: '',
      };

      selectItem.value = String(item);
      selectItem.label = item;

      result.push(selectItem);
    });
  }

  return result;
};
