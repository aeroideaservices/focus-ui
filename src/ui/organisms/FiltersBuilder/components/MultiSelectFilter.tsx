import { FC, memo } from 'react';
import { createStyles, MultiSelect } from '@mantine/core';

import { FilterTypes, TFilterProps } from '../types';
import { useActiveFilters } from '../utils/useActiveFilters';

const useStyles = createStyles(() => ({
  values: {
    width: 'min-content',
  },
  searchInput: {
    width: 'auto !important',
  },
}));

const optionAll = { label: 'Все', value: '' };

export const MultiSelectFilter: FC<TFilterProps<FilterTypes.IFilterMultiSelect>> = memo(
  ({
    initialValue = [],
    code,
    data,
    name,
    placeholder = 'Выберите варианты',
    showOptionAll = false,
    value = initialValue,
    inputProps,
  }) => {
    const { onChange } = useActiveFilters(code, initialValue);
    const displayData = showOptionAll ? [...data, optionAll] : data;
    const { classes } = useStyles();
    const changeHandler = (values: string[]) => {
      if (showOptionAll && values[values.length - 1] === optionAll.value) {
        onChange(initialValue);
        return;
      }

      if (values.includes(optionAll.value)) onChange(values.filter((v) => v !== optionAll.value));
      else onChange(values);
    };

    return (
      <MultiSelect
        clearable
        label={name}
        onChange={changeHandler}
        classNames={classes}
        {...inputProps}
        {...{ data: displayData, placeholder, value: value || initialValue }}
      />
    );
  }
);
