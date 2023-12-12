import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDocumentTitle } from '@mantine/hooks';

import { TITLE_MODELS } from '@/constants/titles';

import ModelContainer from '@/ui/pages/ModelContainer/ModelContainer';
import ModelsContainer from '@/ui/pages/ModelsContainer/ModelsContainer';

const ModelsV2: FC = () => {
  useDocumentTitle(TITLE_MODELS);

  return (
    <Routes>
      <Route index element={<ModelsContainer />} />
      <Route path="/:modelCode" element={<ModelContainer />} />
    </Routes>
  );
};

export default ModelsV2;
