import { FC, PropsWithChildren } from 'react';
import { Box, Divider } from '@mantine/core';

const PageFooter: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box sx={{ marginTop: 'auto', minHeight: 57 }}>
      <Divider my="sm" />
      {children}
    </Box>
  );
};

export default PageFooter;
