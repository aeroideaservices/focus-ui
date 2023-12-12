import { FC, useState } from 'react';
import { Navbar } from '@mantine/core';

import { PLUGIN_ICONS, PLUGIN_NAMES, PLUGIN_PATHS } from '@/constants/plugins';
import { useServices } from '@/hooks/useServices';

import LayoutNavbarBurger from './components/LayoutNavbarBurger/LayoutNavbarBurger';
import LayoutNavbarButton from './components/LayoutNavbarButton/LayoutNavbarButton';
import LayoutNavbarFooter from './components/LayoutNavbarFooter/LayoutNavbarFooter';
import LayoutNavbarLogo from './components/LayoutNavbarLogo/LayoutNavbarLogo';

const LayoutNavbar: FC = () => {
  const [collapse, setCollapse] = useState<boolean>(true);
  const { availablePlugins } = useServices();

  return (
    <Navbar
      width={{ base: collapse ? 230 : 72 }}
      height={'100vh'}
      sx={{ transition: 'width 0.25s ease' }}
    >
      <Navbar.Section pb={24}>
        <LayoutNavbarLogo collapse={collapse} />
        <LayoutNavbarBurger collapse={collapse} onClick={() => setCollapse(!collapse)} />
      </Navbar.Section>

      <Navbar.Section grow>
        {availablePlugins?.map((plugin) => (
          <LayoutNavbarButton
            key={plugin}
            path={PLUGIN_PATHS[plugin]}
            label={PLUGIN_NAMES[plugin]}
            icon={PLUGIN_ICONS[plugin]}
          />
        ))}
      </Navbar.Section>

      <Navbar.Section pb={36}>
        <LayoutNavbarFooter />
      </Navbar.Section>
    </Navbar>
  );
};

export default LayoutNavbar;
