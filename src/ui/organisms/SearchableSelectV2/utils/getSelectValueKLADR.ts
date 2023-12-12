import { HTTPMethodEnum } from '@/types';
import { TAny, TFormField, TSelectData } from '@/types/models_v2/models_v2';

import { fetchingKLADR } from './fetchingKLADR';
import { getSelectDataKLADR } from './getSelectDataKLADR';

export const getSelectValueKLADR = async (
  field: TFormField,
  data: TAny
): Promise<TSelectData[]> => {
  let result: TSelectData[] = [];

  await fetchingKLADR(
    'address-list',
    HTTPMethodEnum.GET,
    data as string[],
    (res) => (result = getSelectDataKLADR(res))
  );

  return result;
};
