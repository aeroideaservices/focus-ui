import { TFormField } from '@/types/models_v2/models_v2';

import { UseFormReturnType } from '@mantine/form';

export const getFieldIndex = (
  formObj: UseFormReturnType<{
    fields: TFormField[];
  }>,
  code: string
): number | null => {
  const fields = formObj.values.fields;
  let index = null;

  fields.forEach((el, i) => {
    if (el.code === code) index = i;
  });

  return index;
};
