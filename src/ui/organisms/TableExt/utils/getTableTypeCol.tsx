import { TypeEnum } from '@/types';

import { Group, Text } from '@mantine/core';

import { getTypeIcon } from './getTypeIcon';

export const getTableTypeCol = (element: Record<string, any>) => {
  return (
    <Group spacing="xs">
      {getTypeIcon(element.type as TypeEnum)}
      <Text>{element.type}</Text>
    </Group>
  );
};
