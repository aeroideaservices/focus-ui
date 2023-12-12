import { HTTPMethodEnum, TElementsRes } from '@/types';
import { TRequest } from '@/types/models_v2/models_v2';

import qs from 'qs';

import { api } from '@/api';

import { OFFSET, SEARCH_LIMIT } from '@/constants/common';

const urlIsAbsolute = (uri: string): boolean => uri.toLowerCase().includes('http');

export const fetching = async (
  request: TRequest,
  value?: string | string[],
  config?: Record<string, unknown>,
  callback?: (value: TElementsRes<Record<string, string>>) => void
): Promise<any> => {
  const { service, uri, meth, body } = request;
  let URL = null;
  let response = null;

  if (urlIsAbsolute(uri)) {
    switch (meth) {
      case HTTPMethodEnum.POST:
        URL = `${uri}`;
        response = await api.post(URL, { ...body, query: value });

        if (response && response.status === 200) {
          if (callback) {
            callback(response.data);
          } else {
            return response;
          }
        }

        break;
      default:
        break;
    }
  } else {
    switch (meth) {
      case HTTPMethodEnum.POST:
        URL = `${uri}?${qs.stringify(
          {
            limit: SEARCH_LIMIT,
            offset: OFFSET,
            query: value,
          },
          { indices: false }
        )}`;

        let reqConfig = {};

        if (service) {
          reqConfig = {
            headers: {
              'Service-Code': service,
            },
          };
        }

        response = await api.post(URL, { ...body, ...config }, { ...reqConfig });

        if (response && response.status === 200) {
          if (callback) {
            callback(response.data);
          } else {
            return response;
          }
        }
        break;
      case HTTPMethodEnum.GET:
        URL = `${uri}?${qs.stringify(
          {
            limit: SEARCH_LIMIT,
            offset: OFFSET,
            query: value,
          },
          { indices: false }
        )}`;

        response = await api.get(URL);

        if (response && response.status === 200) {
          if (callback) {
            callback(response.data);
          } else {
            return response;
          }
        }
        break;
      default:
        break;
    }
  }
};
