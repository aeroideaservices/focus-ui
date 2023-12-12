import { createContext } from 'react';

import { ActiveFilter } from '../types';

interface IFiltersContext {
  onChange: (
    value: ActiveFilter['value'],
    initialValue: ActiveFilter['value'],
    code: ActiveFilter['code']
  ) => void;
}

export const FiltersContext = createContext<IFiltersContext>({
  onChange: () => null,
});
