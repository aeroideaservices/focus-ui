import { FormFieldTypeEnum, TFormField } from '@/types/models_v2/models_v2';

import { cloneDeep } from 'lodash';

export const getInitialValues = (fields: TFormField[]): TFormField[] => {
  const cloneFields = cloneDeep(fields);

  cloneFields.map((field) => {
    switch (field.type) {
      case FormFieldTypeEnum.TEXTINPUT:
        if (field.value === undefined) field.value = '';
        break;
      default:
        break;
    }
  });

  return cloneFields;
};
