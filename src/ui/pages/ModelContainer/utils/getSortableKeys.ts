import { TModelTableElement } from '@/types/models_v2/models_v2';

export const getSortableKeys = (modelViews: TModelTableElement[]) => {
  const keys: string[] = [];

  modelViews.map((model) => model.sortable && keys.push(model.code));

  return keys;
};
