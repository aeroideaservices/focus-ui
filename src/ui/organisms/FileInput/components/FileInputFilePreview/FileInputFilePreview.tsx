import { FC } from 'react';
import { Box, useMantineTheme } from '@mantine/core';
import { IconFile } from '@tabler/icons-react';

const FileInputFilePreview: FC = () => {
  const theme = useMantineTheme();
  return (
    <Box ml="25%" mr="25%">
      <IconFile
        color={theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[5]}
        size="100%"
      />
    </Box>
  );
};

export default FileInputFilePreview;
