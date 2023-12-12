import { TAny, TFormField, TSelectData } from '@/types/models_v2/models_v2';

import { isArray } from 'lodash';

import { fetching } from './fetching';
import { getSelectData } from './getSelectData';

export const getSelectValue = async (field: TFormField, data: TAny): Promise<TSelectData[]> => {
  const { extra } = field;
  let result: TSelectData[] = [];

  if (extra && extra.request && extra.display) {
    await fetching(
      extra.request,
      data as string,
      {
        fields: [...extra.display, extra.identifier],
        filter: {
          identifier: [extra.identifier],
          id: isArray(field.value) ? field.value : [field.value],
        },
      },
      (res) => {
        if (field.sortable) {
          return (result = getSelectData(res.items, {
            valueID: extra.identifier,
            labelID: extra.display && extra.display[1],
            codeID: extra.display && extra.display[0],
          }));
        } else {
          return (result = getSelectData(res.items, {
            valueID: extra.identifier,
            labelID: extra.display && extra.display[0],
            codeID: extra.display && extra.display[1],
          }));
        }
      }
    );
  }

  return result;
};
