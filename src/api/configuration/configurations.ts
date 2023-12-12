import { TAddConfigurationsReq, TConfiguration, TElementsRes, TQueryParamsNew } from 'src/types';

import api from '../instance';
import { URLS } from '../urls';

export const apiGetConfigurations = (params: TQueryParamsNew) =>
  api.get<TElementsRes<TConfiguration>>(URLS.configuration.getConfigurations, {
    params: params.params,
  });

export const apiAddConfigurations = (conf: TAddConfigurationsReq) => {
  const { data } = conf;

  return api.post<{ id: string }>(URLS.configuration.addConfigurations, { ...data });
};
