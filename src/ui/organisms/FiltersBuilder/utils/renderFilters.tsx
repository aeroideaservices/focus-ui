import { FilterViewTypeEnum } from '@/types';

import { createElement, FC } from 'react';
import { Box } from '@mantine/core';

import { CheckboxFilter } from '../components/CheckboxFilter';
import { DateFilter } from '../components/DateFilter';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { MultiSelectFilter } from '../components/MultiSelectFilter';
import { NumericFilter } from '../components/NumericFilter';
import { StringFilter } from '../components/StringFilter';
import { ActiveFiltersMap, TFilter, TFilterProps, TFiltersConfig } from '../types';

const filtersMap = {
  [FilterViewTypeEnum.NUMERIC]: NumericFilter,
  [FilterViewTypeEnum.MULTISELECT]: MultiSelectFilter,
  [FilterViewTypeEnum.DATE_RANGE]: DateRangeFilter,
  [FilterViewTypeEnum.DATE]: DateFilter,
  [FilterViewTypeEnum.CHECKBOX]: CheckboxFilter,
  [FilterViewTypeEnum.STRING]: StringFilter,
  [FilterViewTypeEnum.INT]: NumericFilter,
};

const getFilter = (type: FilterViewTypeEnum) => {
  return filtersMap[type] as FC<TFilterProps<TFilter>>;
};

export const renderFilters = (filtersConfig: TFiltersConfig, activeFilters: ActiveFiltersMap) => {
  return filtersConfig.map((filterProps) => (
    <Box key={filterProps.code} sx={{ flex: '1 0 0' }}>
      {filtersMap[filterProps.viewType]
        ? createElement(getFilter(filterProps.viewType), {
            ...filterProps,
            value: activeFilters[filterProps.code]?.value ?? filterProps.initialValue,
          })
        : null}
    </Box>
  ));
};
