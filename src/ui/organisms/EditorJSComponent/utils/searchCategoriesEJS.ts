import { HTTPMethodEnum } from '@/types';

import qs from 'qs';

import { api } from '@/api';

const searchCategoriesEJS = async (value: string, opts: any) => {
  const { meth, service, uri } = opts;
  let response = null;
  const params = {
    offset: 0,
    limit: 20,
    query: value,
  };

  if (meth === HTTPMethodEnum.POST) {
    response = await api.post(`${uri}?${qs.stringify(params)}`, {
      headers: {
        'Service-Code': service,
      },
    });
  }

  return response;
};

export default searchCategoriesEJS;
