import { FormFieldTypeEnum, TFormField } from '@/types/models_v2/models_v2';

export const getModelFiltersValues = (fields: TFormField[]) => {
  const result: Record<string, unknown> = {};

  fields.forEach((field) => {
    switch (field.type) {
      case FormFieldTypeEnum.SELECT:
        if (field.value && (field.value as []).length > 0) {
          result[field.code] = field.value;
        }
        break;
      case FormFieldTypeEnum.DATETIMEPICKER:
        if (field.value && (field.value as string[])[0] && (field.value as string[])[1]) {
          result[field.code] = field.value;
        }
        break;
      default:
        result[field.code] = field.value;
        break;
    }
  });

  return result;
};
