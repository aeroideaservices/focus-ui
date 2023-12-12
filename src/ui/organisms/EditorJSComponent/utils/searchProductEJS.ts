import { HTTPMethodEnum } from '@/types';

import { api } from '@/api';

const searchProductEJS = async (value: string, opts: any) => {
  const { meth, service, uri } = opts;
  let response = null;

  if (meth === HTTPMethodEnum.GET) {
    response = await api.get(uri, {
      params: {
        offset: 0,
        limit: 20,
        query: value,
      },
      headers: {
        'Service-Code': service,
      },
    });
  }

  return response;
};

export default searchProductEJS;
