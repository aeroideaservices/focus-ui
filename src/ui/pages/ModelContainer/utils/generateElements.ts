import { TModelTableElement, TObject } from '@/types/models_v2/models_v2';

import { getDataFormat } from './getDataFormat';

export const generateElements = (data: TObject[], modelViews: TModelTableElement[]) => {
  const elements: Record<string, string>[] = [];

  data.map((el) => {
    const element: Record<string, string> = {};

    for (const key in el) {
      const modelConfig = modelViews.filter((model) => model.code === key);
      const isTime = modelConfig.length > 0 ? modelConfig[0].isTime : false;

      element[key] = getDataFormat(el[key], isTime);
    }

    elements.push(element);
  });

  return elements;
};
