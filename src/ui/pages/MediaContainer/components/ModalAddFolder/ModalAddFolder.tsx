import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Text } from '@mantine/core';

import FormAddFolder from '../FormAddFolder/FormAddFolder';

import { AppDispatch } from '@/store';
import { selectAddFolderModal, setAddFolderModalOpened } from '@/store/slices/media/mediaFolders';

const ModalAddFolder: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const opened = useSelector(selectAddFolderModal);

  return (
    <Modal
      centered
      opened={opened}
      onClose={() => dispatch(setAddFolderModalOpened(false))}
      title={
        <Text fz={22} fw={700}>
          Новая папка
        </Text>
      }
    >
      <FormAddFolder />
    </Modal>
  );
};

export default ModalAddFolder;
