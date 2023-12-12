import { useCallback, useContext } from 'react';

import { TFilter } from '../types';

import { FiltersContext } from './filtersContext';

export const useActiveFilters = <T extends TFilter['initialValue']>(
  code: string,
  initialValue: TFilter['initialValue']
) => {
  const { onChange } = useContext(FiltersContext);

  const changeHandler = useCallback(
    (value: T) => {
      onChange(value, initialValue, code);
    },
    [initialValue, code]
  );

  return { onChange: changeHandler };
};
