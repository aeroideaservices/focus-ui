import { HTTPMethodEnum } from '@/types';

import qs from 'qs';

import { api } from '@/api';

import { MultiSelectDataProps } from '../../SearchableSelect/utils/getSearchData';

export const fetchingKLADR = async (
  url: string,
  meth: HTTPMethodEnum,
  query: string | string[],
  callback: (values: MultiSelectDataProps[]) => void,
  options?: Record<string, unknown>
) => {
  switch (meth) {
    case HTTPMethodEnum.POST:
      await api
        .post(`${process.env.GEO_API_URL}/${url}`, {
          ...options,
          query,
        })
        .then((res) => {
          if (res) {
            callback(res.data);
          }
        });

      break;
    case HTTPMethodEnum.GET:
      await api
        .get(
          `${process.env.GEO_API_URL}/${url}?${qs.stringify({ query: query }, { indices: false })}`,
          { ...options }
        )
        .then((res) => {
          if (res) {
            callback(res.data.items);
          }
        });
      break;
    default:
      break;
  }
};
