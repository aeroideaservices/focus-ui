import { FC } from 'react';
import { Group, GroupProps, Select, Text } from '@mantine/core';

import { LIMIT, PAGE_ELEMENTS } from '@/constants/common';

interface IShowElements extends GroupProps {
  defaultValue: number | string;
  changeCallback: (value: number) => void;
}

const ShowElements: FC<IShowElements> = ({ defaultValue, changeCallback, ...props }) => {
  const changeHandler = (value: string | null) => {
    changeCallback(value ? Number(value) : LIMIT);
  };

  return (
    <Group position={'right'} pr={12} noWrap {...props}>
      <Text size="xs" color="dimmed">
        Показывать
      </Text>
      <Select
        miw={70}
        maw={70}
        size={'sm'}
        defaultValue={String(defaultValue)}
        data={PAGE_ELEMENTS}
        onChange={(e) => changeHandler(e)}
      />
    </Group>
  );
};

export default ShowElements;
