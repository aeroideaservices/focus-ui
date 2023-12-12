import { TValidationField } from '@/types/models_v2/models_v2';

import { validationTexts } from '@/constants/validationTexts';

export const getErrMessages = (
  props?: Record<string, TValidationField>
): Record<string, Record<string, string>> => {
  const errMessages: Record<string, Record<string, string>> = {};

  if (props) {
    for (const key in props) {
      if (props[key].required) {
        errMessages[key] = {
          required: `${validationTexts.REQUIRED}: ${props[key].title}`,
        };
      }
    }
  }

  return errMessages;
};
