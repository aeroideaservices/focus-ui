import { TFormField } from '@/types/models_v2/models_v2';

import { isEqual } from 'lodash';

import { getModelFiltersValues } from './getModelFiltersValues';

export const filterIsChange = (
  initialValues: TFormField[],
  filterValues: TFormField[]
): boolean => {
  const initial = getModelFiltersValues(initialValues);
  const current = getModelFiltersValues(filterValues);

  return !isEqual(initial, current);
};
