import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { MantineProvider, MantineThemeOverride } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import { extraAppShell } from './assets/styles/extraAppShell';
import { extraColors } from './assets/styles/extraColors';
import { extraModal } from './assets/styles/extraModal';
import { useAuthToken } from './hooks/useAuthToken';

const focusTheme: MantineThemeOverride = {
  colorScheme: 'dark',
  primaryColor: 'jungle-mist',
  defaultRadius: 3,
};

const App: FC = () => {
  useAuthToken();

  return (
    <MantineProvider
      withNormalizeCSS
      withGlobalStyles
      theme={{
        components: {
          ...extraAppShell,
          ...extraModal,
        },
        colors: { ...extraColors },
        ...focusTheme,
      }}
    >
      <Notifications position="top-right" limit={5} />
      <Outlet />
    </MantineProvider>
  );
};

export default App;
