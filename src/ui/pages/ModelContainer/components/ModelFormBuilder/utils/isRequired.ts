import { TValidationField } from '@/types/models_v2/models_v2';

export const isRequired = (props?: Record<string, TValidationField>, code?: string): boolean => {
  if (props && code) {
    return props[code] && props[code].required ? true : false;
  }

  return false;
};
