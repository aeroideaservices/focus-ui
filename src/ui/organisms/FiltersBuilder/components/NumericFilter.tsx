import { FC, memo } from 'react';
import { NumberInput } from '@mantine/core';

import { FilterTypes, TFilterProps } from '../types';
import { useActiveFilters } from '../utils/useActiveFilters';

export const NumericFilter: FC<TFilterProps<FilterTypes.IFilterNumeric>> = memo(
  ({
    code,
    name,
    placeholder = 'Введите число',
    initialValue,
    value = initialValue,
    inputProps,
  }) => {
    const { onChange } = useActiveFilters(code, initialValue);
    return <NumberInput label={name} {...inputProps} {...{ onChange, value, placeholder }} />;
  }
);
