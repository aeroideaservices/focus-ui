import { useMemo } from 'react';

import { transliteration, TTransliterationOptions } from '@/utils/transliteration';

interface IInputChangeHandlerProps {
  currentTarget: { value: string };
}

interface IUseTranslitFormOptions<T extends Record<string, string>> {
  form: {
    values: T;
    setFieldValue: (path: keyof T, value: string) => void;
  };
  inputNames: {
    original: keyof T;
    translit: keyof T;
  };
  opts?: TTransliterationOptions;
  active?: boolean;
}

export const useTranslitForm = <T extends Record<string, string>>({
  inputNames: { original, translit },
  form,
  opts,
  active = true,
}: IUseTranslitFormOptions<T>) => {
  const synced = useMemo(
    () => form.values[translit] === transliteration(form.values[original], opts),
    [form.values]
  );

  const setOriginalHandler = ({ currentTarget: { value } }: IInputChangeHandlerProps) => {
    if (synced && active) form.setFieldValue(translit, transliteration(value, opts));
  };

  return {
    setOriginalHandler,
  };
};
