import { FC, PropsWithChildren } from 'react';
import { Box } from '@mantine/core';

const Page: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      {children}
    </Box>
  );
};

export default Page;
