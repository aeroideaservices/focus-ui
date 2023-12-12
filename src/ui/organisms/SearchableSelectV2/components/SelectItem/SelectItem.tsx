import { forwardRef } from 'react';
import { Group, Text } from '@mantine/core';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  code: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, code, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Text color="gray">{code}</Text>
        <Text>{label}</Text>
      </Group>
    </div>
  )
);

export default SelectItem;
