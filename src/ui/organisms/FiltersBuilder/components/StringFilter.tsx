import { ChangeEvent, FC, useState } from 'react';
import { TextInput } from '@mantine/core';
import { debounce } from 'lodash';

import { FilterTypes, TFilterProps } from '../types';
import { useActiveFilters } from '../utils/useActiveFilters';

export const StringFilter: FC<TFilterProps<FilterTypes.IFilterString>> = ({
  name,
  code,
  initialValue,
  value = initialValue,
  inputProps,
}) => {
  const [currentValue, setValue] = useState(value);
  const { onChange } = useActiveFilters(code, initialValue);

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    setValue(newValue);
    debounce(() => onChange(newValue), 500);
  };

  return <TextInput label={name} {...inputProps} value={currentValue} onChange={changeHandler} />;
};
