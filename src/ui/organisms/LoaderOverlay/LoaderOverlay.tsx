import { FC } from 'react';
import { LoadingOverlay, LoadingOverlayProps, useMantineTheme } from '@mantine/core';

export const LoaderOverlay: FC<LoadingOverlayProps> = ({ ...props }) => {
  const theme = useMantineTheme();

  return (
    <LoadingOverlay
      {...props}
      overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[7] : '#FFFFFF'}
      overlayOpacity={1}
      // loader={
      //   // <img
      //   //   src="/images/loader.gif"
      //   //   style={{ minWidth: 0, minHeight: 0, maxHeight: '80%', maxWidth: '80%' }}
      //   // />
      // }
    />
  );
};
