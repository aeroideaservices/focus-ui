import { FC, PropsWithChildren } from 'react';
import { Container, Paper } from '@mantine/core';

const PageBody: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Container fluid pos="relative" sx={{ width: '100%', flex: 1 }}>
      <Paper
        radius={8}
        p={24}
        shadow="xs"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          maxHeight: '100%',
          overflow: 'hidden',
        }}
      >
        {children}
      </Paper>
    </Container>
  );
};

export default PageBody;
