import { FC } from 'react';
import { Center, Group, Text, UnstyledButton } from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';

import { useStyles } from './style';

interface ITableHeadSortable {
  name: string;
  reversed?: boolean;
  sorted?: boolean | null;
  onSort(): void;
}

const TableHeadSortable: FC<ITableHeadSortable> = ({ name, reversed, sorted, onSort }) => {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;

  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group
          position="left"
          spacing={'xs'}
          sx={{
            display: 'flex',
            flexWrap: 'nowrap',
          }}
        >
          <Center className={classes.icon}>
            <Icon size={14} />
          </Center>
          <Text weight={700} size="sm" sx={{ whiteSpace: 'nowrap' }} color={'gray.5'}>
            {name}
          </Text>
        </Group>
      </UnstyledButton>
    </th>
  );
};

export default TableHeadSortable;
