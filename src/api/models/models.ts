import { TQueryParams } from '@/types';
import { IListRes, TModel, TModelItem } from '@/types/models_v2/models_v2';

import api from '../instance';
import { URLS } from '../urls';

export const apiGetModels = (params: TQueryParams) =>
  api.get<IListRes<TModelItem>>(URLS.models_v2.models.getModels, { params });

export const apiGetModel = (modelCode: string) =>
  api.get<TModel>(URLS.models_v2.models.getModel(modelCode));
