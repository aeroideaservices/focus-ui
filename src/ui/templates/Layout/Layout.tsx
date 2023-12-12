import { FC, useMemo } from 'react';
import { AppShell } from '@mantine/core';

import { withServices } from '@/hocs/withServices';
import { usePluginNavigation } from '@/hooks/usePluginNavigation';
import { useServices } from '@/hooks/useServices';

import LayoutNavbar from './components/LayoutNavbar/LayoutNavbar';
import { renderPlugin } from './utils/renderPlugin';

const Layout: FC = () => {
  const { currentPlugin } = usePluginNavigation();
  const { availablePlugins } = useServices();

  const isPluginAvailable = useMemo(
    () => currentPlugin && availablePlugins.includes(currentPlugin),
    [availablePlugins, currentPlugin]
  );

  return (
    <AppShell
      fixed
      navbar={<LayoutNavbar />}
      styles={{ main: { transition: 'padding-left 0.25s ease' } }}
    >
      {currentPlugin && isPluginAvailable && renderPlugin(currentPlugin)}
    </AppShell>
  );
};

export default withServices(Layout);
