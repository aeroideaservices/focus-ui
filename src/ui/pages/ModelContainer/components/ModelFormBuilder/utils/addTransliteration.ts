import { InputUtilsEnum, TExtraField, TFormField } from '@/types/models_v2/models_v2';

import { UseFormReturnType } from '@mantine/form';

import { transliteration } from '@/utils/transliteration';

import { getFieldIndex } from './getFieldIndex';

export const addTransliteration = (
  formObj: UseFormReturnType<{
    fields: TFormField[];
  }>,
  type: 'new' | 'edit',
  extra?: TExtraField
): React.FormEventHandler<HTMLInputElement> | undefined => {
  if (!extra || !extra.utils) return undefined;
  const { utils } = extra;

  for (let index = 0; index < utils.length; index++) {
    switch (utils[index].code) {
      case InputUtilsEnum.SLUGIFY:
        return type !== 'edit'
          ? (el: React.FormEvent<HTMLInputElement>) => {
              formObj
                .getInputProps(`fields.${getFieldIndex(formObj, utils[index].field)}.value`)
                .onChange(transliteration(el.currentTarget.value, { onlyLower: true }));
            }
          : undefined;
      default:
        break;
    }
  }

  return undefined;
};
