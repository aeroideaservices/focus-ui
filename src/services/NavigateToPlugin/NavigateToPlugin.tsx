import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { PLUGIN_PATHS } from '@/constants/plugins';
import { withServices } from '@/hocs/withServices';
import { useServices } from '@/hooks/useServices';

const NavigateToPlugin: FC = () => {
  const { availablePlugins } = useServices();
  const navigate = useNavigate();

  useEffect(() => {
    if (!availablePlugins.length) return;

    navigate(PLUGIN_PATHS[availablePlugins[0]]);
  }, [availablePlugins]);

  return null;
};

export default withServices(NavigateToPlugin);
