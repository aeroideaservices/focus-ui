import { IModelFieldValuesReq } from '@/types/api/models_v2';
import { IListRes, TAnyOf } from '@/types/models_v2/models_v2';

import api from '../instance';
import { URLS } from '../urls';

export const apiGetModelFieldValues = ({ modelCode, fieldCode, params }: IModelFieldValuesReq) =>
  api.get<IListRes<TAnyOf>>(
    URLS.models_v2.modelFieldValues.getModelFieldValues(modelCode, fieldCode),
    {
      params,
    }
  );
