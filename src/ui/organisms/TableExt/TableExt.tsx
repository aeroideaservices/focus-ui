import { TTableConfig } from '@/types';
import { TModelTableElement } from '@/types/models_v2/models_v2';

import { FC, memo, useEffect, useState } from 'react';
import { TableProps } from '@mantine/core';
import { Checkbox, ScrollArea, Table } from '@mantine/core';
import { isEqual } from 'lodash';

import { getTableHeaders } from './utils/getTableHeaders';
import { getTableRows } from './utils/getTableRows';
import { includeRow } from './utils/includeRow';
import { sortData } from './utils/sortData';
import { useStyles } from './style';

interface ITableExt extends TableProps {
  config: TTableConfig[] | TModelTableElement[];
  scrollheight?: number;
  rows: Record<string, any>[];
  buttons?: FC<any>;
  selectable?: boolean;
  selectCallback?: (values: Record<string, string>[]) => void;
  sortableKeys?: string[];
}

const TableExt: FC<ITableExt> = memo(
  ({ config, rows, scrollheight, buttons, selectable, selectCallback, sortableKeys, ...props }) => {
    const { classes, cx } = useStyles();
    const [scrolled, setScrolled] = useState(false);
    const [selection, setSelection] = useState<Record<string, string>[]>([]);
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [sortedData, setSortedData] = useState<Record<string, any>[] | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);

    useEffect(() => {
      setSortedData(rows);
    }, [rows]);

    useEffect(() => {
      if (selectCallback) selectCallback(selection);
    }, [selection]);

    const toggleAll = () => setSelection((current) => (current.length === rows.length ? [] : rows));

    const toggleRow = (item: Record<string, string>) =>
      setSelection((current) => {
        return includeRow(current, item)
          ? current.filter((el) => !isEqual(el, item))
          : [...current, item];
      });

    const setSorting = (field: string) => {
      const reversed = field === sortBy ? !reverseSortDirection : false;
      setReverseSortDirection(reversed);
      setSortBy(field);
      setSortedData(sortData(rows, { sortBy: field, reversed, search: '' }));
    };

    return (
      <ScrollArea
        classNames={{
          root: classes.root,
        }}
        h={scrollheight ? scrollheight - 10 : '100%'}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        viewportProps={{ style: { position: 'relative', zIndex: 0 } }}
        type="hover"
      >
        <Table highlightOnHover verticalSpacing="sm" fontSize="md" {...props}>
          <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <tr>
              {selectable && (
                <th style={{ width: 40 }}>
                  <Checkbox
                    onChange={toggleAll}
                    checked={selection.length === rows.length}
                    indeterminate={selection.length > 0 && selection.length !== rows.length}
                    transitionDuration={0}
                  />
                </th>
              )}
              {getTableHeaders(
                config,
                buttons ? true : false,
                sortableKeys,
                setSorting,
                reverseSortDirection,
                sortBy
              )}
            </tr>
          </thead>
          <tbody>
            {getTableRows(
              config,
              sortedData,
              buttons,
              selectable,
              selection,
              toggleRow,
              sortableKeys
            )}
          </tbody>
        </Table>
      </ScrollArea>
    );
  }
);

export default TableExt;
