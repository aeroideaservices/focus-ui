import { useMemo, useState } from 'react';

import { ActiveFilter, ActiveFiltersMap } from '@/ui/organisms/FiltersBuilder/types';

type FilterMapFn<R = any> = (value: any) => R;

type FiltersMappers = {
  [key: string]: FilterMapFn;
};

export const useFilters = (mappers: FiltersMappers = {}) => {
  const [activeFilters, setCurrentFilters] = useState<ActiveFiltersMap>({});

  const mappedFilters = useMemo<Record<string, ActiveFilter['value']>>(
    () =>
      Object.values(activeFilters).reduce((res, filter) => {
        const filterMapper = mappers[filter.code];
        return {
          ...res,
          [filter.code]: filterMapper ? filterMapper(filter.value) : filter.value,
        };
      }, {}),
    [activeFilters]
  );

  return {
    filters: mappedFilters,
    onFiltersChange: setCurrentFilters,
  };
};
