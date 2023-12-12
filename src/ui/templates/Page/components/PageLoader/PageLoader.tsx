import { FC } from 'react';
import { Box, BoxProps, Center, Text } from '@mantine/core';

import { LoaderOverlay } from '@/ui/organisms/LoaderOverlay/LoaderOverlay';

interface IPageLoader extends BoxProps {
  loading: boolean;
  text: string;
  zIndex?: number;
}

const PageLoader: FC<IPageLoader> = ({ loading, text, zIndex = 100, ...props }) => {
  return (
    <Box sx={{ position: 'relative', height: '100%' }} {...props}>
      <LoaderOverlay visible={loading} zIndex={zIndex} />

      {!loading && text && (
        <Center sx={{ height: '100%' }}>
          <Text align={'center'} color="dimmed">
            {text}
          </Text>
        </Center>
      )}
    </Box>
  );
};

export default PageLoader;
