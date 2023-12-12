import { TAny } from '@/types/models_v2/models_v2';

import { setFormatDate } from '@/utils/setFormatDate';

export const getDataFormat = (data: TAny, isTime: boolean) => {
  switch (typeof data) {
    case 'boolean':
      return data ? 'Да' : 'Нет';
    case 'string':
      if (isTime) {
        return setFormatDate(data, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      } else {
        return data;
      }
    default:
      return `${data}`;
  }
};
