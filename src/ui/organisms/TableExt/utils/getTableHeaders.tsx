import { TTableConfig } from '@/types';

import { Text } from '@mantine/core';

import TableHeadSortable from '../components/TableHeadSortable/TableHeadSortable';

export const getTableHeaders = (
  config: TTableConfig[],
  buttons?: boolean,
  sortableKeys?: string[],
  onSort?: (code: string) => void,
  reversed?: boolean,
  sortBy?: string | null
) => {
  const headers = (
    <>
      {config.map((el, index) => {
        if (sortableKeys && sortableKeys.includes(el.code)) {
          return (
            <TableHeadSortable
              key={`${el.name}${index}`}
              name={el.name}
              onSort={() => onSort && onSort(el.code)}
              reversed={reversed}
              sorted={sortBy === el.code}
            />
          );
        }

        return (
          <th key={`${el.name}${index}`}>
            <Text sx={{ whiteSpace: 'nowrap' }} color={'gray.5'}>
              {el.name}
            </Text>
          </th>
        );
      })}

      {buttons && <th></th>}
    </>
  );

  return headers;
};
