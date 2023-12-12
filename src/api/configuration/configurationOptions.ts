import {
  TAddConfigurationOptionsReq,
  TGetConfigurationOptionsReq,
  TGetConfigurationOptionsRes,
  TPutConfigurationOptionsReq,
} from '@/types';

import api from '../instance';
import { URLS } from '../urls';

export const apiGetConfigurationOptions = (data: TGetConfigurationOptionsReq) => {
  const { id, params } = data;

  return api.get<TGetConfigurationOptionsRes>(URLS.configuration.getConfigurationsOptionsById(id), {
    params,
  });
};

export const apiAddConfigurationOptions = (data: TAddConfigurationOptionsReq) => {
  const { id, option } = data;

  return api.post<{ id: string }>(URLS.configuration.addConfigurationsOptionsById(id), {
    ...option,
  });
};

export const apiPutConfigurationOptions = (data: TPutConfigurationOptionsReq) => {
  const { id, options } = data;

  return api.put(URLS.configuration.putConfigurationsOptionsById(id), options);
};
