import { FC, ReactNode } from 'react';
import { Box, BoxProps, Flex, Text, useMantineTheme } from '@mantine/core';

interface IMediaSummaryItem extends BoxProps {
  name: string;
  value: string | ReactNode;
}

const MediaSummaryItem: FC<IMediaSummaryItem> = ({ name, value, ...props }) => {
  const { colors } = useMantineTheme();
  return (
    <Flex {...props} align="baseline" gap={4}>
      <Text color={'dimmed'} size={14}>
        {name}
      </Text>
      <Box
        sx={{
          flexGrow: 1,
          border: `1px dashed ${colors.gray[4]}`,
        }}
      />
      <Text sx={{ wordBreak: 'break-all' }}>{value}</Text>
    </Flex>
  );
};

export default MediaSummaryItem;
