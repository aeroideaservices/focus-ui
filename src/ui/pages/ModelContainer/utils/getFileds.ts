import { FormFieldTypeEnum, TFormField, TObject } from '@/types/models_v2/models_v2';

import { cloneDeep } from 'lodash';

export const getFileds = (fields: TFormField[], initialData?: TObject | null): TFormField[] => {
  if (!initialData) return fields;
  const cloneFields = cloneDeep(fields);

  cloneFields.map((field) => {
    switch (field.type) {
      case FormFieldTypeEnum.CHECKBOX:
        field.checked = !!initialData[field.code];
        break;
      case FormFieldTypeEnum.DATEPICKERINPUT:
      case FormFieldTypeEnum.DATETIMEPICKER:
        if (initialData[field.code]) field.value = new Date(initialData[field.code] as string);
        break;
      case FormFieldTypeEnum.INTINPUT:
      case FormFieldTypeEnum.FLOATINPUT:
      case FormFieldTypeEnum.UINTINPUT:
        if (initialData[field.code] || initialData[field.code] === 0)
          field.value = Number(initialData[field.code]);
        break;
      case FormFieldTypeEnum.KLADRSELECT:
      case FormFieldTypeEnum.SELECT:
      case FormFieldTypeEnum.RATING:
        if (initialData[field.code]) field.value = initialData[field.code];
        break;
      default:
        if (initialData[field.code]) field.value = initialData[field.code];
        break;
    }
  });

  return cloneFields;
};
