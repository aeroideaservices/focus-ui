import { FormFieldTypeEnum, TAny, TFormField, TValidationField } from '@/types/models_v2/models_v2';

import { buildYup } from 'schema-to-yup';
import { setLocale } from 'yup';

import { yupCustomLocale } from '@/constants/yupCustomLocale';

import { getErrMessages } from './getErrMessages';
import { getSchema } from './getSchema';

setLocale(yupCustomLocale);

export const formValidate = (
  value: TAny | undefined,
  array: {
    fields: TFormField[];
  },
  path: string,
  validation?: Record<string, TValidationField>
): string | null => {
  const field = array.fields[parseInt(path.split('.')[1])];
  const fieldValidation =
    validation && validation[field.code]
      ? {
          [field.code]: validation[field.code],
        }
      : null;

  if (fieldValidation) {
    const schema = getSchema(fieldValidation);
    const builderConfig = {
      mode: { notRequired: true },
      errMessages: getErrMessages(validation),
    };
    const yupSchema = buildYup(schema, builderConfig);

    switch (field.type) {
      case FormFieldTypeEnum.INTINPUT:
      case FormFieldTypeEnum.FLOATINPUT:
      case FormFieldTypeEnum.UINTINPUT:
        if (value === '') {
          try {
            yupSchema.validateSync({ [field.code]: null });
          } catch (err) {
            return `${err}`.slice(17);
          }
        } else {
          try {
            yupSchema.validateSync({ [field.code]: value });
          } catch (err) {
            return `${err}`.slice(17);
          }
        }
        break;
      default:
        if (value === '') {
          try {
            yupSchema.validateSync({ [field.code]: undefined });
          } catch (err) {
            return `${err}`.slice(17);
          }
        } else {
          try {
            yupSchema.validateSync({ [field.code]: value });
          } catch (err) {
            return `${err}`.slice(17);
          }
        }
        break;
    }
  }

  return null;
};
