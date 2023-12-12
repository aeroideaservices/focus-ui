import { FormFieldTypeEnum, TFormField } from '@/types/models_v2/models_v2';

export const getTransformedFormValues = (fields: TFormField[]): Record<string, unknown> => {
  let result: Record<string, unknown> = {};

  fields.map((field) => {
    switch (field.type) {
      case FormFieldTypeEnum.CHECKBOX:
        result[field.code] = field.checked ? true : false;
        break;
      case FormFieldTypeEnum.PHONEINPUT:
        if (field.value) {
          result[field.code] = (field.value as string).replaceAll('-', '').replaceAll(' ', '');
        }
        break;
      case FormFieldTypeEnum.INTINPUT:
      case FormFieldTypeEnum.FLOATINPUT:
      case FormFieldTypeEnum.UINTINPUT:
        if (field.value === '') {
          result[field.code] = null;
        } else if (field.value) {
          result[field.code] = field.value;
        }
        break;
      case FormFieldTypeEnum.COLORSINPUT:
        if ((field.value as string[]).length > 0) result[field.code] = field.value;
        break;
      default:
        if (field.value) result[field.code] = field.value;
        break;
    }
  });

  return result;
};
