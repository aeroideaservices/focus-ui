import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDocumentTitle } from '@mantine/hooks';

import { TITLE_MEDIA } from '@/constants/titles';

import MediaContainer from '@/ui/pages/MediaContainer/MediaContainer';

const Media: FC = () => {
  useDocumentTitle(TITLE_MEDIA);

  return (
    <Routes>
      <Route index element={<MediaContainer />} />
      <Route path="/:folderId" element={<MediaContainer />} />
    </Routes>
  );
};

export default Media;
