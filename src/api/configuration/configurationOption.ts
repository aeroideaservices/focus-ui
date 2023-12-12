import {
  TConfigurationOption,
  TConfigurationOptionParams,
  TPutConfigurationOptionReq,
} from '@/types';

import api from '../instance';
import { URLS } from '../urls';

export const apiGetConfigurationOption = (params: TConfigurationOptionParams) => {
  const { confId, optId } = params;

  return api.get<TConfigurationOption>(
    URLS.configuration.putConfigurationOptionById(confId, optId)
  );
};

export const apiPutConfigurationOption = ({ params, data }: TPutConfigurationOptionReq) => {
  const { confId, optId } = params;

  return api.put(URLS.configuration.putConfigurationOptionById(confId, optId), { ...data });
};

export const apiDelConfigurationOption = (params: TConfigurationOptionParams) => {
  const { confId, optId } = params;

  return api.delete(URLS.configuration.delConfigurationOptionById(confId, optId));
};
