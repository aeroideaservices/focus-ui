import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDocumentTitle } from '@mantine/hooks';

import { TITLE_MENU } from '@/constants/titles';

import MenuContainer from '@/ui/pages/MenuContainer/MenuContainer';
import MenusContainer from '@/ui/pages/MenusContainer/MenusContainer';

const Menus: FC = () => {
  useDocumentTitle(TITLE_MENU);

  return (
    <Routes>
      <Route index element={<MenusContainer />} />
      <Route path=":menuId" element={<MenuContainer />} />
    </Routes>
  );
};

export default Menus;
