import { Box } from '@mantine/core';
import { IconFolder } from '@tabler/icons-react';

export const MAX_BREADCRUMBS_LENGTH = 2;
export const FOLDER_ICON = (
  <Box pos="relative" top={2}>
    <IconFolder size={16} />
  </Box>
);

export const STATIC_PARAMS = {
  sort: 'name',
};
