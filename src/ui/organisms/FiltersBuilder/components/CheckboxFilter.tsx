import { FC } from 'react';
import { Select } from '@mantine/core';

import { FilterTypes, TFilterProps } from '../types';
import { useActiveFilters } from '../utils/useActiveFilters';

const valuesMap = {
  true: true,
  false: false,
};

const selectData = [
  { label: 'Да', value: 'true' },
  { label: 'Нет', value: 'false' },
];

export const CheckboxFilter: FC<TFilterProps<FilterTypes.IFilterCheckbox>> = ({
  code,
  name,
  initialValue = undefined,
  value = initialValue,
  inputProps,
  placeholder = 'Выберите вариант',
}) => {
  const { onChange } = useActiveFilters(code, initialValue);
  const changeHandler = (v: 'true' | 'false' | null) => {
    onChange(v ? valuesMap[v] : initialValue);
  };

  return (
    <Select
      clearable
      {...{ inputProps }}
      placeholder={placeholder}
      data={selectData}
      label={name}
      checked={value}
      onChange={changeHandler}
      value={typeof value === 'undefined' ? null : value.toString()}
      w="auto"
    />
  );
};
