import { TConfigurationOption, TypeEnum } from '@/types';

import { randomId } from '@mantine/hooks';

export type TFields = {
  label: string;
  name: string;
  type: TypeEnum;
  key: string;
  checked?: boolean;
  value?: string;
};

export const getInitialValuesFromOptions = (options: TConfigurationOption[]) => {
  const fields: TFields[] = [];

  options.map((option) => {
    let value: string | Date | boolean | number | null | undefined = option.value
      ? option.value
      : '';

    if (option.type === TypeEnum.INTEGER) {
      value = option.value ? Number(option.value) : undefined;
    }

    if (option.type === TypeEnum.DATETIME || option.type === TypeEnum.DATE) {
      value = option.value ? new Date(option.value) : undefined;
    }

    if (option.type === TypeEnum.CHECKBOX) {
      value = option.value === 'true' ? true : false;
    }

    fields.push({
      key: randomId(),
      type: option.type,
      label: option.name,
      name: option.code,
      [option.type !== TypeEnum.CHECKBOX ? 'value' : 'checked']: value,
    });
  });

  return fields;
};
