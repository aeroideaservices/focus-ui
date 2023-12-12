import { FC, memo, useCallback, useMemo, useState } from 'react';
import { Box, Flex, Group, Skeleton } from '@mantine/core';
import { Button } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { isEmpty, isEqual } from 'lodash';

import { FiltersContext } from './utils/filtersContext';
import { renderFilters } from './utils/renderFilters';
import { ActiveFilter, ActiveFiltersMap, TFiltersConfig } from './types';

interface IFiltersBuilder {
  loading: boolean;
  filtersConfig: TFiltersConfig;
  onFiltersChange?: (filters: ActiveFiltersMap) => void;
}

const initialFiltersValue = {};

const FiltersBuilder: FC<IFiltersBuilder> = memo(
  ({ loading, filtersConfig: filtersConfig, onFiltersChange }) => {
    const [filters, setFilters] = useState<ActiveFiltersMap>(initialFiltersValue);

    const filterChangeHandler = useCallback(
      (value: ActiveFilter['value'], initialValue: ActiveFilter['value'], code: string) => {
        setFilters((activeFilters) => {
          const newFilters = { ...activeFilters };
          if (isEqual(value, initialValue)) delete newFilters[code];
          else newFilters[code] = { value, code };

          if (onFiltersChange) onFiltersChange(newFilters);
          if (!isEqual(activeFilters, newFilters)) return newFilters;
          else return activeFilters;
        });
      },
      []
    );

    const filtersContextValue = useMemo(() => {
      return { onChange: filterChangeHandler };
    }, [filterChangeHandler]);

    const resetFilters = () => {
      setFilters(initialFiltersValue);
      if (onFiltersChange) onFiltersChange({});
    };

    return (
      <FiltersContext.Provider value={filtersContextValue}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            width: 'fit-content',
            alignItems: 'end',
          }}
        >
          <Flex gap={15} align="flex-end">
            <Box sx={{ flexGrow: 0 }}>
              {!loading && (
                <Flex gap={15} align="flex-end" w="100%" wrap="wrap" sx={{ whiteSpace: 'nowrap' }}>
                  {renderFilters(filtersConfig, filters)}
                </Flex>
              )}
              {loading && (
                <Group grow sx={{ width: '100%' }}>
                  <Skeleton height={60} width={'auto'} />
                  <Skeleton height={60} width={'auto'} />
                  <Skeleton height={60} width={'auto'} />
                  <Skeleton height={60} width={'auto'} />
                </Group>
              )}
            </Box>
            <Box w={130} sx={{ flex: '0 0 0' }}>
              {!isEmpty(filters) && (
                <Button rightIcon={<IconRefresh />} variant="subtle" onClick={resetFilters}>
                  Сбросить
                </Button>
              )}
            </Box>
          </Flex>
        </Box>
      </FiltersContext.Provider>
    );
  }
);

export default FiltersBuilder;
