import { FormFieldTypeEnum, TAny, TFormField } from '@/types/models_v2/models_v2';

import { cloneDeep, isArray } from 'lodash';

import { getFilterFromRouter } from '../../../utils/getFilterFromRouter';

export const getInitialValues = (
  fields: TFormField[],
  searchParams: URLSearchParams
): TFormField[] => {
  const cloneFields = cloneDeep(fields);
  const filtersValue = getFilterFromRouter(searchParams);

  cloneFields.map((field) => {
    if (filtersValue[field.code]) {
      switch (field.type) {
        case FormFieldTypeEnum.DATETIMEPICKER:
        case FormFieldTypeEnum.DATEPICKERINPUT:
          if (isArray(filtersValue[field.code])) {
            field.value = (filtersValue[field.code] as string[]).map((el) => new Date(el));
          } else {
            field.value = new Date(filtersValue[field.code] as string);
          }
          break;
        default:
          field.value = filtersValue[field.code] as TAny;
          break;
      }
    }
  });

  return cloneFields;
};
