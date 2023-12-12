import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Text } from '@mantine/core';

import FormRenameFolder from '../FormRenameFolder/FormRenameFolder';

import { AppDispatch } from '@/store';
import {
  selectRenameFolderModal,
  setRenameFodlerModalOpened,
} from '@/store/slices/media/mediaFolders';

const ModalRenameFolder: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const opened = useSelector(selectRenameFolderModal);

  return (
    <Modal
      centered
      opened={opened}
      onClose={() => dispatch(setRenameFodlerModalOpened(false))}
      title={
        <Text fz={22} fw={700}>
          Переименовать
        </Text>
      }
    >
      <FormRenameFolder />
    </Modal>
  );
};

export default ModalRenameFolder;
