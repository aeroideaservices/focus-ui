import { HTTPMethodEnum, TFormBuilderRequest } from '@/types';

import { api } from '@/api';

import { getSearchData, MultiSelectDataProps } from './getSearchData';
import getSearchDataKladdr from './getSearchDataKladdr';

const fetchingSearch = async (
  value: string,
  options: TFormBuilderRequest,
  callback: (values: MultiSelectDataProps[]) => void
) => {
  const { uri, meth, body, service } = options;

  if (meth === HTTPMethodEnum.GET) {
    const res = await api.get(uri, {
      params: {
        ...body,
        query: value,
        limit: 50,
        offset: 0,
      },
      headers: {
        'Service-Code': service ? service : 'content',
      },
    });

    if (res) {
      callback(getSearchData(res.data.items));
    }
  }

  if (meth === HTTPMethodEnum.POST) {
    const res = await api.post(`${process.env.GEO_API_URL_FOR_KLADDER}/${uri}`, {
      ...body,
      query: value,
    });

    if (res) {
      callback(getSearchDataKladdr(res.data));
    }
  }
};

export default fetchingSearch;
