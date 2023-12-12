import {
  TConfiguration,
  TDeleteConfigurationReq,
  TGetConfigurationReq,
  TPutConfigurationReq,
} from '@/types';

import api from '../instance';
import { URLS } from '../urls';

export const apiGetConfiguration = (data: TGetConfigurationReq) =>
  api.get<TConfiguration>(URLS.configuration.getConfigurationsById(data.confId));

export const apiPutConfiguration = ({ id, data }: TPutConfigurationReq) =>
  api.put(URLS.configuration.putConfigurationsById(id), { ...data });

export const apiDelConfiguration = (data: TDeleteConfigurationReq) =>
  api.delete(URLS.configuration.delConfigurationsById(data.id));
