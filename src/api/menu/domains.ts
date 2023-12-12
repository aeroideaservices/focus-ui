import { TElementsRes, TQueryParams } from '@/types';

import api from '../instance';
import { URLS } from '../urls';

export const apiGetDomains = (params: TQueryParams) => {
  return api.get<TElementsRes<Record<string, string>>>(URLS.menus.getDomains, { params });
};

export const apiAddDomain = (data: Record<string, string>) => {
  return api.post<Record<string, string>>(URLS.menus.addDomain, data);
};
