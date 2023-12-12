import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDocumentTitle } from '@mantine/hooks';

import { TITLE_CONFIGURATION } from '@/constants/titles';

import ConfigurationContainer from '@/ui/pages/ConfigurationContainer/ConfigurationContainer';
import ConfigurationsContainer from '@/ui/pages/ConfigurationsContainer/ConfigurationsContainer';

const Configurations: FC = () => {
  useDocumentTitle(TITLE_CONFIGURATION);

  return (
    <Routes>
      <Route index element={<ConfigurationsContainer />} />
      <Route path=":confId" element={<ConfigurationContainer />} />
    </Routes>
  );
};

export default Configurations;
