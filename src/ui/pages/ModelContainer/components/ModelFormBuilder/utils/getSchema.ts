import { TValidationField } from '@/types/models_v2/models_v2';

import { cloneDeep } from 'lodash';

export const getSchema = (validation?: Record<string, TValidationField>) => {
  const props = cloneDeep(validation);
  const schema = {
    type: 'object',
    properties: {
      ...props,
    },
  };

  return schema;
};
