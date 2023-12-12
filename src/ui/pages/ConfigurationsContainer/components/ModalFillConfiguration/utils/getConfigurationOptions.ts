import { TConfigurationOptionsItem, TypeEnum } from '@/types';

import { TFields } from '@/ui/organisms/FormBuilder/utils/getInitialValuesFromOptions';

export const getConfigurationOptions = (values: Record<string, unknown>) => {
  const fields = values.fields as TFields[];
  const options: TConfigurationOptionsItem[] = [];

  const getTransformValue = (field: TFields) => {
    if (field.type === TypeEnum.DATE || field.type === TypeEnum.DATETIME) {
      return field.value;
    }

    if (field.type === TypeEnum.CHECKBOX) {
      return String(field.checked);
    }

    if (field.type === TypeEnum.INTEGER) {
      return field.value ? String(field.value) : '0';
    }

    if (field.type === TypeEnum.FILE || field.type === TypeEnum.IMAGE) {
      return field.value ? String(field.value) : null;
    }

    return String(field.value);
  };

  fields.map((field) => {
    options.push(<TConfigurationOptionsItem>{
      code: String(field.name),
      value: getTransformValue(field),
    });
  });

  return options;
};
